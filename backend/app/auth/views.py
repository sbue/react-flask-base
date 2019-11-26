import json
from operator import itemgetter

from flask import Blueprint, jsonify, request, Response, abort, url_for, current_app
import flask_jwt_extended as jwt
from marshmallow import Schema

from app import db
from app.decorators import login_required
from app.email import send_email
from app.models.user import User
from app.auth.fields import name_field, email_field, password_field
from app.auth.utils import authenticate, get_current_user, validate_request

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
    resp = jsonify({
        'user': {
            'firstName': current_user.first_name.title(),
            'lastName': current_user.last_name.title(),
            'email': current_user.email,
        },
        'isAdmin': current_user.is_admin(),
    })
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
        if User.query.filter_by(email=data["email"]).first() is not None:
            raise ValueError("Email already in use.")
        else:
            user = User(**data)
            token = user.generate_confirmation_token().decode()
            confirm_link = current_app.config['FRONTEND_URL'] + \
                f"/confirm-email/{token}"
            send_email(recipient=user.email,
                       subject='Confirm Your Account',
                       template='account/email/confirm',
                       user=user,
                       confirm_link=confirm_link)
            db.session.add(user)
            db.session.commit()
            resp = authenticate(user)
            return resp, 200
    except ValueError as e:
        return Response(str(e), 400)


# Endpoint for revoking the current users access token
@auth.route('/logout', methods=['DELETE'])
@jwt.jwt_required
def logout():
    resp = jsonify({})
    jwt.unset_jwt_cookies(resp)
    return resp, 200


@auth.route("/confirm-email/<token>")
@login_required
def confirm_email(token, current_user):
    """Confirm new user's account with provided token."""
    if current_user.confirmed:
        return jsonify({}), 200
    if current_user.confirm_account(token.encode()):
        return Response("Your account has been confirmed.", 200)
    else:
        return Response("The confirmation link is invalid or has expired.", 400)


@auth.route('/reset-password', methods=['POST'])
def reset_password_request():
    """Respond to existing user's request to reset their password."""
    class ResetPasswordSchema(Schema):
        email = email_field
    try:
        data = validate_request(request, ResetPasswordSchema)
        user = User.query.filter_by(email=data["email"]).first()
        if not user:
            raise ValueError("No matching user for email.")
        else:
            token = user.generate_password_reset_token().decode()
            reset_link = current_app.config["FRONTEND_URL"] + \
                f"/login/reset-password/{token}"
            send_email(recipient=user.email,
                       subject="Reset Your Password",
                       template="account/email/reset_password",
                       user=user,
                       reset_link=reset_link,
                       next=request.args.get('next'))
    except ValueError as e:
        return Response(str(e), 400)


@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    """Reset an existing user's password."""
    class ResetPasswordSchema(Schema):
        password = password_field
    try:
        data = validate_request(request, ResetPasswordSchema)
        user = User.reset_password(token, data["password"])
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
        if current_user.verify_password(data["old_password"]):
            current_user.password = data["new_password"]
            db.session.add(current_user)
            db.session.commit()
            return jsonify({}), 200
        else:
            raise ValueError("Original password is invalid.")
    except ValueError as e:
        return Response(str(e), 400)
