import json
from operator import itemgetter
from urllib.parse import urlencode

import flask_jwt_extended as jwt
from flask import Blueprint, current_app, jsonify, request, Response
from marshmallow import Schema, fields, validate

from app import db
from app.decorators import login_required
from app.email import send_email
from app.models.user import User

auth = Blueprint('auth', __name__)

name_field = fields.Str(required=True, validate=validate.Length(min=2, max=50))
email_field = fields.Email(required=True, validate=validate.Length(min=4, max=250))
password_field = fields.Str(required=True, validate=validate.Length(min=8, max=250))


@auth.route('/refresh-access-token', methods=['POST'])
@jwt.jwt_refresh_token_required
def refresh_access_token():
    user_id = jwt.get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return Response("UNAUTHORIZED", 401)
    access_token = jwt.create_access_token(identity=user_id)
    resp = jsonify({})
    jwt.set_access_cookies(resp, access_token)
    return resp, 200


@auth.route('/login', methods=['POST'])
def login():
    """Log in an existing user."""
    class LoginSchema(Schema):
        email = email_field
        password = password_field
    schema = LoginSchema()
    if not request.data:
        return Response("Invalid request", 200)
    data = json.loads(request.data)
    validation_errors = schema.validate(data)
    if validation_errors:
        return Response(str(validation_errors), 400)
    else:
        email, password = itemgetter('email', 'password')(data)
        user = User.query.filter_by(email=email).first()
        if user is None:
            return Response("No matching user for email.", 400)
        elif user.password_hash is None or not user.verify_password(password):
            return Response("Incorrect password.", 400)
        else:
            import datetime
            access_token = jwt.create_access_token(identity=user.id, expires_delta=datetime.timedelta(seconds=3))
            refresh_token = jwt.create_refresh_token(identity=user.id)
            resp = jsonify({
                'user': {
                    'firstName': user.first_name.title(),
                    'lastName': user.last_name.title(),
                    'email': user.email,
                },
            })
            jwt.set_access_cookies(resp, access_token)
            jwt.set_refresh_cookies(resp, refresh_token)
            return resp, 200


@auth.route('/sign-up', methods=['POST'])
def sign_up():
    """Register a new user, and send them a confirmation email."""
    class RegisterSchema(Schema):
        first_name = name_field
        last_name = name_field
        email = email_field
        password = password_field
    schema = RegisterSchema()
    if not request.data:
        return Response("Invalid request", 200)
    data = json.loads(request.data)
    validation_errors = schema.validate(data)
    if validation_errors:
        return Response(str(validation_errors), 400)
    else:
        email, password = itemgetter('email', 'password')(data)
        user_exists = User.query.filter_by(email=email).first() is not None
        if user_exists:
            return Response("Email already in use", 400)
        else:
            user = User(**data)
            confirmation_token = user.generate_confirmation_token().decode()
            confirm_link = f"{current_app.config['FRONTEND_URL']}" \
                           f"/confirm-email?" \
                           f"{urlencode({'token': confirmation_token})}"
            send_email(recipient=user.email,
                       subject='Confirm Your Account',
                       template='account/email/confirm',
                       user=user,
                       confirm_link=confirm_link)
            db.session.add(user)
            db.session.commit()
            import datetime  # TODO: remove me
            access_token = jwt.create_access_token(identity=user.id, expires_delta=datetime.timedelta(seconds=5))
            refresh_token = jwt.create_refresh_token(identity=user.id  )
            resp = jsonify({
                'user': {
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                },
            })
            jwt.set_access_cookies(resp, access_token)
            jwt.set_refresh_cookies(resp, refresh_token)
            return resp, 200


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


@auth.route("/protected")
@login_required
def protected():
    return Response("Nice!", 200)