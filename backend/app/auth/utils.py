import json
from flask import jsonify
import flask_jwt_extended as jwt
from app.models.user import User


def authenticate(user):
    access_token = jwt.create_access_token(identity=user.id)
    refresh_token = jwt.create_refresh_token(identity=user.id)
    resp = jsonify({
        'user': {
            'firstName': user.first_name.title(),
            'lastName': user.last_name.title(),
            'email': user.email,
        },
        'isAdmin': user.is_admin(),
        'isConfirmedByEmail': user.confirmed,
    })
    jwt.set_access_cookies(resp, access_token)
    jwt.set_refresh_cookies(resp, refresh_token)
    return resp


def get_current_user():
    user_id = jwt.get_jwt_identity()
    return User.query.filter_by(id=user_id).first()


def validate_request(request, schema):
    if not request.data:
        raise Exception("Invalid request")
    else:
        data = json.loads(request.data)
        validation_errors = schema().validate(data)
        if validation_errors:
            raise ValueError(str(validation_errors))
        return data
