import os
import logging
import json
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from app import create_app


def validate_request(request, schema):
    if not request.data:
        raise ValueError("Invalid request")
    else:
        data = json.loads(request.data)
        validation_errors = schema().validate(data)
        if validation_errors:
            raise ValueError(str(validation_errors))
        return data


def to_camel_case(obj):
    if type(obj) == str:
        split = obj.split('_')
        return split[0] + ''.join(tok.title() for tok in split[1:])
    elif type(obj) == list:
        return [to_camel_case(o) for o in obj]
    elif type(obj) == dict:
        return {to_camel_case(k): (to_camel_case(v) if type(v) == dict else v)
                for (k, v) in obj.items()}
    else:
        return obj


def deserialize_data(token):
    app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    with app.app_context():
        s = Serializer(app.config['SECRET_KEY'])
        try:
            return s.loads(token)
        except (BadSignature, SignatureExpired):
            return None
