from flask import (Blueprint, jsonify, abort, Response, request)
from marshmallow import Schema, fields, validate

from app import db
from app.utils import validate_request
from app.auth.fields import name_validate, email_validate, name_field, email_field
from app.decorators import admin_required
from app.models.user import Role, User
from app.admin.utils import get_user_payload
from app.admin.emails import send_join_from_invite_email

admin = Blueprint('admin', __name__)


@admin.route('/invite-user', methods=['POST'])
@admin_required
def invite_user():
    """Invites a new user to create an account and set their own password."""
    class InviteUserSchema(Schema):
        first_name = name_field
        last_name = name_field
        email = email_field
        role = fields.Str(validate=validate.OneOf(Role.get_roles()))
    try:
        data = validate_request(request, InviteUserSchema)
        if User.query.filter_by(email=data['email']).first() is not None:
            raise ValueError("Email already in use.")
        user = User(
            role=Role(data['role']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
        )
        db.session.add(user)
        db.session.flush()
        db.session.expunge(user)
        send_join_from_invite_email(user)
        return jsonify({'userID': user.id}), 200
    except ValueError as e:
        return Response(str(e), 400)


@admin.route('/users', methods=['GET'])
@admin_required
def fetch_users():
    """View all registered users."""
    users = User.query.all()
    resp = jsonify({user.id: get_user_payload(user) for user in users})
    return resp, 200


@admin.route('/user/<int:user_id>/delete', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    """Request deletion of a user's account."""
    if user_id == current_user.id:
        return Response("You cannot delete your own account. Please "
                        "ask another administrator to do this.", 400)
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        abort(404)
    db.session.delete(user)
    db.session.commit()
    return jsonify({}), 200


@admin.route('/user/<int:user_id>/update', methods=['POST'])
@admin_required
def update_user(user_id):
    """Update information on a user's account."""
    class UpdateUserSchema(Schema):
        first_name = fields.Str(required=False, validate=name_validate)
        last_name = fields.Str(required=False, validate=name_validate)
        email = fields.Email(required=False, validate=email_validate)
        role = fields.Str(required=False, validate=validate.OneOf(Role.get_roles()))
        verified_email = fields.Boolean(required=False)
    try:
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            abort(404)
        data = validate_request(request, UpdateUserSchema)
        user_updated = False
        email_updated = False
        if len(data) > 0:
            for field, new_value in data.items():
                old_value = getattr(user, field)
                if field == 'role':
                    new_value = Role(new_value)
                if old_value != new_value:
                    if field == 'email':
                        email_updated = True
                    setattr(user, field, new_value)
                    user_updated |= True
            if user_updated:
                if email_updated:
                    user.verified_email = not user.is_admin()  # Don't lock out admins
                db.session.add(user)
                db.session.commit()
                return jsonify(get_user_payload(user)), 200
        raise ValueError("Request didn't include any changes.")
    except ValueError as e:
        return Response(str(e), 400)
