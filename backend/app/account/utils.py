from flask import jsonify
import flask_jwt_extended as jwt

from app import s3_fs
from app.models.user import User
from app.utils import to_camel_case


def authenticate_payload(user):
    data = {
        'userID': user.id,
        'role': user.role.value,
        'verified_email': user.verified_email,
        'first_name': user.first_name.title(),
        'last_name': user.last_name.title(),
        'email': user.email,
        'profile_photo': None,
    }
    if user.profile_photo_s3_key:
        key = user.profile_photo_s3_key
        data['profile_photo'] = {
            'url': s3_fs.url(key),
            'file_name': key[key.rfind('/') + 1:],
        }
    return jsonify(to_camel_case(data))


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
