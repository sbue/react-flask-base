from flask import jsonify
import flask_jwt_extended as jwt
from app.models.user import User
from app.utils import to_camel_case


def authenticate_payload(user):
    data = [('first_name', user.first_name.title()),
            ('last_name', user.last_name.title()),
            ('email', user.email),
            ('is_admin', user.is_admin()),
            ('verified_email', user.verified_email)]
    return jsonify(to_camel_case({k: v for (k, v) in data}))


def authenticate(user):
    access_token = jwt.create_access_token(identity=user.id)
    refresh_token = jwt.create_refresh_token(identity=user.id)
    resp = authenticate_payload(user)
    jwt.set_access_cookies(resp, access_token)
    jwt.set_refresh_cookies(resp, refresh_token)
    return resp


def get_current_user():
    user_id = jwt.get_jwt_identity()
    return User.query.filter_by(id=user_id).first()
