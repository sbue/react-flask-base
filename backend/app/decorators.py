from functools import wraps
from flask import abort
from flask_jwt_extended import (get_jwt_identity as get_current_user_id,
                                jwt_required)

from app.models.user import User


def login_required(f):
    @jwt_required
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_current_user_id()
        current_user = User.query.filter_by(id=current_user_id).first()
        if current_user is not None:
            # only pass down user if current_user is a parameter
            if "current_user" in f.__code__.co_varnames:
                return f(*args, current_user=current_user, **kwargs)
            else:
                return f(*args, **kwargs)
        else:
            abort(403)
    return decorated_function


def admin_required(f):
    @login_required
    @wraps(f)
    def decorated_function(*args, current_user, **kwargs):
        if current_user.is_admin():
            if "current_user" in f.__code__.co_varnames:
                return f(*args, current_user=current_user, **kwargs)
            else:
                return f(*args, **kwargs)
        else:
            abort(403)
    return decorated_function


# Used for disabling routes
def disabled(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        abort(404)
    return decorated_function
