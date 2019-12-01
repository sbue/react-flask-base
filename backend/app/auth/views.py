from operator import itemgetter

from flask import Blueprint, jsonify, request, Response, abort, current_app
import flask_jwt_extended as jwt
from marshmallow import Schema

from app import db
from app.decorators import login_required
from app.utils import validate_request
from app.models.user import User
from app.auth.fields import name_field, email_field, password_field
from app.auth.utils import authenticate, get_current_user, authenticate_payload
from app.auth.emails import send_confirm_email, send_reset_password_email

auth = Blueprint('auth', __name__)


@auth.route('/refresh-access-token', methods=['POST'])
@jwt.jwt_refresh_token_required
def refresh_access_token():
    user = get_current_user()
    if user:
        access_token = jwt.create_access_token(identity=user.id)
        resp = jsonify({})
        jwt.set_access_cookies(resp, access_token)
        return resp, 200
    abort(404)


@auth.route('/check-auth')
@login_required
def check_auth(current_user):
    resp = authenticate_payload(current_user)
    return resp, 200


# Endpoint for revoking the current users access token
@auth.route('/logout', methods=['DELETE'])
@login_required
def logout():
    resp = jsonify({})
    jwt.unset_jwt_cookies(resp)
    return resp, 200


@auth.route('/login', methods=['POST'])
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
        elif user.password_hash is None or not user.verify_password(password):
            raise ValueError("Incorrect password.")
        else:
            resp = authenticate(user)
            return resp, 200
    except ValueError as e:
        return Response(str(e), 400)


@auth.route('/sign-up', methods=['POST'])
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
            send_confirm_email(user, current_app.config['FRONTEND_URL'])
            db.session.add(user)
            db.session.commit()
            resp = authenticate(user)
            return resp, 200
    except ValueError as e:
        return Response(str(e), 400)


@auth.route('/resend-confirm-email', methods=['POST'])
@login_required
def resend_confirm_email(current_user):
    """Resend confirmation email"""
    try:
        if current_user.verified_email:
            raise ValueError("User has already verified their email")
        send_confirm_email(current_user, current_app.config['FRONTEND_URL'])
        return jsonify({}), 200
    except ValueError as e:
        return Response(str(e), 400)


@auth.route('/verify-email/<token>', methods=["POST"])
@login_required
def verify_email(current_user, token):
    """Verify new user's account with provided token."""
    if current_user.verified_email or current_user.verify_email(token.encode()):
        return jsonify({}), 200
    else:
        return Response("The confirmation link is invalid or has expired.", 400)


@auth.route('/reset-password', methods=['POST'])
def reset_password_request():
    """Respond to existing user's request to reset their password."""
    class ResetPasswordSchema(Schema):
        email = email_field
    try:
        data = validate_request(request, ResetPasswordSchema)
        user = User.query.filter_by(emails=data['email']).first()
        if not user:
            raise ValueError("No matching user for email.")
        else:
            send_reset_password_email(user, current_app.config['FRONTEND_URL'],
                                      request.args.get('next'))
    except ValueError as e:
        return Response(str(e), 400)


@auth.route('/reset-password/<token>', methods=['POST'])
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


@auth.route('/manage/change-password', methods=['POST'])
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
            db.session.add(current_user)
            db.session.commit()
            # TODO: send email confirming password change
            return jsonify({}), 200
        else:
            raise ValueError("Original password is invalid.")
    except ValueError as e:
        return Response(str(e), 400)
