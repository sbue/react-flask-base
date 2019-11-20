from functools import wraps
from flask import abort
from flask_jwt_extended import (get_jwt_identity as get_current_user_email,
                                jwt_required)

from app.models.user import User, Permission


def login_required(f):
    @jwt_required
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_email = get_current_user_email()
        current_user = User.query.filter_by(email=current_user_email).first()
        if current_user is not None:
            if "current_user" in f.__code__.co_varnames:
                return f(*args, current_user=current_user, **kwargs)
            else:
                return f(*args, **kwargs)
        else:
            abort(403)
    return decorated_function


def permission_required(permission):
    """Restrict a view to users with the given permission."""

    def decorator(f):
        @login_required
        @wraps(f)
        def decorated_function(*args, current_user, **kwargs):
            if not current_user.can(permission):
                abort(403)
            return f(*args, **kwargs)

        return decorated_function

    return decorator


def admin_required(f):
    return permission_required(Permission.ADMINISTER)(f)
