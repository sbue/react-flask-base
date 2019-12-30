from flask import jsonify
import flask_jwt_extended as jwt

from app.utils import get_config
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
    }
    return jsonify(to_camel_case(data))


def add_domain_to_cookies(resp):
    config = get_config()
    # get domain
    if config['DEBUG']:
        domain = "localhost"
    else:
        domain = config['FRONTEND_URL']
        domain = domain[domain.rfind('.', 0, domain.rfind('.')) + 1:]
        domain = domain.replace('https://', '')
    # add domain to headers
    original_headers = resp.headers.copy()
    resp.headers.clear()
    for (key, value) in original_headers:
        if key == 'Set-Cookie':
            value += f"; Domain={domain}"
            resp.headers.add(key, value)
    return resp


def authenticate(user):
    access_token = jwt.create_access_token(identity=user.id)
    refresh_token = jwt.create_refresh_token(identity=user.id)
    resp = authenticate_payload(user)
    jwt.set_access_cookies(resp, access_token)
    jwt.set_refresh_cookies(resp, refresh_token)
    resp = add_domain_to_cookies(resp)
    print(resp.headers)
    return resp


def get_current_user():
    user_id = jwt.get_jwt_identity()
    return User.query.filter_by(id=user_id).first()
