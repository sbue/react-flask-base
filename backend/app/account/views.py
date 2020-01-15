import logging
from operator import itemgetter
from flask import Blueprint, jsonify, request, Response, abort
import flask_jwt_extended as jwt
from marshmallow import Schema, fields

from app import db_session, s3_fs
from app.decorators import login_required, file_upload
from app.utils import validate_request, deserialize_data, to_camel_case
from app.models.user import User
from app.account.fields import name_field, email_field, password_field, name_validate
from app.account.utils import authenticate, get_current_user, authenticate_payload
from app.account.emails import send_confirm_email, send_reset_password_email, send_change_email

account = Blueprint('account', __name__)


@account.route('/refresh-access-token', methods=['POST'])
@jwt.jwt_refresh_token_required
def refresh_access_token():
    user = get_current_user()
    if user:
        access_token = jwt.create_access_token(identity=user.id)
        resp = jsonify({})
        jwt.set_access_cookies(resp, access_token)
        return resp, 200
    abort(404)


@account.route('/check-auth')
@login_required
def check_auth(current_user):
    resp = authenticate_payload(current_user)
    return resp, 200


# Endpoint for revoking the current users access token
@account.route('/logout', methods=['DELETE'])
@login_required
def logout():
    resp = jsonify({})
    jwt.unset_jwt_cookies(resp)
    return resp, 200


@account.route('/login', methods=['POST'])
def login():
    """Log in an existing user."""
    class LoginSchema(Schema):
        email = email_field
        password = password_field
    try:
        data = validate_request(request, LoginSchema)
        email, password = itemgetter('email', 'password')(data)
        user = User.query.filter_by(email=email).first()
        if user is None:
            raise ValueError("No matching user for email.")
        elif user.password_hash is None:
            raise ValueError("Password not set. Please check for email invite.")
        elif not user.verify_password(password):
            raise ValueError("Incorrect password.")
        else:
            resp = authenticate(user)
            return resp, 200
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/sign-up', methods=['POST'])
def sign_up():
    """Register a new user, and send them a confirmation email."""
    class RegisterSchema(Schema):
        first_name = name_field
        last_name = name_field
        email = email_field
        password = password_field
    try:
        data = validate_request(request, RegisterSchema)
        if User.query.filter_by(email=data['email']).first() is not None:
            raise ValueError("Email already in use.")
        else:
            user = User(**data)
            db_session.add(user)
            db_session.flush()
            db_session.expunge(user)
            send_confirm_email(user)
            resp = authenticate(user)
            return resp, 200
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/resend-confirm-email', methods=['POST'])
@login_required
def resend_confirm_email(current_user):
    """Resend confirmation email"""
    try:
        if current_user.verified_email:
            raise ValueError("User has already verified their email")
        db_session.expunge(current_user)
        send_confirm_email(current_user)
        return jsonify({}), 200
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/verify-email/<token>', methods=['POST'])
@login_required
def verify_email(current_user, token):
    """Verify new user's account with provided token."""
    db_session.expunge(current_user)
    if current_user.verified_email or current_user.verify_email(token.encode()):
        return jsonify({}), 200
    else:
        return Response("The confirmation link is invalid or has expired.", 400)


@account.route('/reset-password', methods=['POST'])
def reset_password_request():
    """Respond to existing user's request to reset their password."""
    class ResetPasswordSchema(Schema):
        email = email_field
    try:
        data = validate_request(request, ResetPasswordSchema)
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            raise ValueError("No matching user for email.")
        else:
            send_reset_password_email(user, request.args.get('next'))
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    """Reset an existing user's password."""
    class ResetPasswordSchema(Schema):
        password = password_field
    try:
        data = validate_request(request, ResetPasswordSchema)
        user = User.reset_password(token, data['password'])
        if not user:
            raise ValueError("The password reset link is invalid or has expired")
        else:
            resp = authenticate(user)
            return resp, 200
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/sign-up/join-from-invite/<token>', methods=['POST'])
def join_from_invite(token):
    """Reset an existing user's password."""
    class JoinFromInviteSchema(Schema):
        password = password_field
    try:
        request_data = validate_request(request, JoinFromInviteSchema)
        token_data = deserialize_data(token)
        if token_data:
            user_id = token_data.get('id')
            user = User.query.filter_by(id=user_id).first()
            if not user:
                logging.warning(f"User with id {user_id} does not exist.")
            else:
                user.verified_email = True
                user.password = request_data['password']
                db_session.add(user)
                db_session.commit()
                resp = authenticate(user)
                return resp, 200
        raise ValueError("The join from invite link is invalid or has expired.", 400)
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/settings/change-password', methods=['POST'])
@login_required
def change_password(current_user):
    """Change an existing user's password."""
    class ChangePasswordSchema(Schema):
        old_password = password_field
        new_password = password_field
    try:

        data = validate_request(request, ChangePasswordSchema)
        if current_user.verify_password(data['old_password']):
            current_user.password = data['new_password']
            db_session.add(current_user)
            db_session.commit()
            # TODO: send email confirming password change
            return jsonify({}), 200
        else:
            raise ValueError("Original password is invalid.")
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/settings/change-email', methods=['POST'])
@login_required
def change_email(current_user):
    """Change an existing user's email."""
    class ChangeEmailSchema(Schema):
        new_email = email_field
    try:
        data = validate_request(request, ChangeEmailSchema)
        if User.query.filter_by(email=data['new_email']).first() is not None:
            raise ValueError("Email already in use.")
        else:
            current_user.email = data['new_email']
            current_user.verified_email = not current_user.is_admin()  # Don't lock out admins
            db_session.add(current_user)
            db_session.flush()
            db_session.expunge(current_user)
            send_change_email(current_user)
            # TODO: send email to old email notifying email change
            return jsonify({}), 200
    except ValueError as e:
        return Response(str(e), 400)


@account.route('/settings/delete-account', methods=['DELETE'])
@login_required
def delete_user(current_user):
    """Delete a user's account."""
    if current_user.is_admin():
        return Response("You cannot delete your own account. Please "
                        "ask another administrator to do this.", 400)
    else:
        current_user.clean()
        db_session.delete(current_user)
        db_session.commit()
        resp = jsonify({})
        jwt.unset_jwt_cookies(resp)
        return resp, 200


@account.route('/settings/change-user-info', methods=['POST'])
@login_required
def change_user_info(current_user):
    """Change an existing user's email."""
    class ChangeUserInfoSchema(Schema):
        first_name = fields.Str(required=False, validate=name_validate)
        last_name = fields.Str(required=False, validate=name_validate)
    try:
        data = validate_request(request, ChangeUserInfoSchema)
        if len(data) == 0:
            raise ValueError("Request didn't include any changes.")
        if 'first_name' in data:
            current_user.first_name = data['first_name']
        if 'last_name' in data:
            current_user.last_name = data['last_name']
        db_session.add(current_user)
        db_session.commit()
        return authenticate_payload(current_user), 200
    except ValueError as e:
        return Response(str(e), 400)


@file_upload(content_types=['image/jpeg', 'image/png'])
def _upload_profile_photo(current_user, files):
    current_user.upload_profile_photo(files[0])
    resp = jsonify(to_camel_case({
        'url': current_user.profile_photo_url(),
        'file_name': files[0].filename,
    }))
    return resp, 200


def _delete_profile_photo(current_user):
    s3_fs.rm(current_user.profile_photo_s3_key)
    current_user.profile_photo_s3_key = ""
    db_session.add(current_user)
    db_session.commit()
    resp = jsonify({})
    return resp, 200


@account.route('/settings/profile-photo', methods=['POST', 'DELETE'])
@login_required
def profile_photo(current_user):
    if request.method == 'POST':
        return _upload_profile_photo(current_user=current_user)
    elif request.method == 'DELETE':
        return _delete_profile_photo(current_user=current_user)
    else:
        abort(405)
