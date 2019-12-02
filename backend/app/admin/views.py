from flask import (Blueprint, jsonify, abort, Response, request)
from marshmallow import Schema, fields, validate

from app import db
from app.utils import validate_request, to_camel_case
from app.auth.fields import name_validate, email_validate
from app.decorators import admin_required
from app.email import send_email
from app.models.user import Role, User
from app.admin.utils import get_user_payload

admin = Blueprint('admin', __name__)


# @admin.route('/')
# @login_required
# @admin_required
# def index():
#     """Admin dashboard page."""
#     return render_template('admin/index.html')
#
#
# @admin.route('/new-user', methods=['GET', 'POST'])
# @login_required
# @admin_required
# def new_user():
#     """Create a new user."""
#     form = NewUserForm()
#     if form.validate_on_submit():
#         user = User(
#             role=form.role.data,
#             first_name=form.first_name.data,
#             last_name=form.last_name.data,
#             email=form.email.data,
#             password=form.password.data)
#         db.session.add(user)
#         db.session.commit()
#         flash('User {} successfully created'.format(user.full_name()),
#               'form-success')
#     return render_template('admin/new_user.html', form=form)
#
#
# @admin.route('/invite-user', methods=['GET', 'POST'])
# @login_required
# @admin_required
# def invite_user():
#     """Invites a new user to create an account and set their own password."""
#     form = InviteUserForm()
#     if form.validate_on_submit():
#         user = User(
#             role=form.role.data,
#             first_name=form.first_name.data,
#             last_name=form.last_name.data,
#             email=form.email.data)
#         db.session.add(user)
#         db.session.commit()
#         token = user.generate_confirmation_token()
#         invite_link = url_for(
#             'account.join_from_invite',
#             user_id=user.id,
#             token=token,
#             _external=True)
#         get_queue().enqueue(
#             send_email,
#             recipient=user.email,
#             subject='You Are Invited To Join',
#             template='account/email/invite',
#             user=user,
#             invite_link=invite_link,
#         )
#         flash('User {} successfully invited'.format(user.full_name()),
#               'form-success')
#     return render_template('admin/new_user.html', form=form)
#
#
@admin.route('/users')
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
        role = fields.Str(required=False, validate=validate.OneOf(Role.get_private_roles()))
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
                    user.verified_email = False
                db.session.add(user)
                db.session.commit()
                return jsonify(get_user_payload(user)), 200
        raise ValueError("Request didn't include any changes.")
    except ValueError as e:
        return Response(str(e), 400)


# @admin.route('/user/<int:user_id>')
# @admin.route('/user/<int:user_id>/info')
# @login_required
# @admin_required
# def user_info(user_id):
#     """View a user's profile."""
#     user = User.query.filter_by(id=user_id).first()
#     if user is None:
#         abort(404)
#     return render_template('admin/manage_user.html', user=user)
#
#
# @admin.route('/user/<int:user_id>/change-email', methods=['GET', 'POST'])
# @login_required
# @admin_required
# def change_user_email(user_id):
#     """Change a user's email."""
#     user = User.query.filter_by(id=user_id).first()
#     if user is None:
#         abort(404)
#     form = ChangeUserEmailForm()
#     if form.validate_on_submit():
#         user.email = form.email.data
#         db.session.add(user)
#         db.session.commit()
#         flash('Email for user {} successfully changed to {}.'.format(
#             user.full_name(), user.email), 'form-success')
#     return render_template('admin/manage_user.html', user=user, form=form)
#
#
# @admin.route(
#     '/user/<int:user_id>/change-account-type', methods=['GET', 'POST'])
# @login_required
# @admin_required
# def change_account_type(user_id):
#     """Change a user's account type."""
#     if current_user.id == user_id:
#         flash('You cannot change the type of your own account. Please ask '
#               'another administrator to do this.', 'error')
#         return redirect(url_for('admin.user_info', user_id=user_id))
#
#     user = User.query.get(user_id)
#     if user is None:
#         abort(404)
#     form = ChangeAccountTypeForm()
#     if form.validate_on_submit():
#         user.role = form.role.data
#         db.session.add(user)
#         db.session.commit()
#         flash('Role for user {} successfully changed to {}.'.format(
#             user.full_name(), user.role.name), 'form-success')
#     return render_template('admin/manage_user.html', user=user, form=form)
#
#
#
#
# @admin.route('/user/<int:user_id>/_delete')
# @login_required
# @admin_required
# def delete_user(user_id):
#     """Delete a user's account."""
#     if current_user.id == user_id:
#         flash('You cannot delete your own account. Please ask another '
#               'administrator to do this.', 'error')
#     else:
#         user = User.query.filter_by(id=user_id).first()
#         db.session.delete(user)
#         db.session.commit()
#         flash('Successfully deleted user %s.' % user.full_name(), 'success')
#     return redirect(url_for('admin.registered_users'))
#
#
# @admin.route('/_update_editor_contents', methods=['POST'])
# @login_required
# @admin_required
# def update_editor_contents():
#     """Update the contents of an editor."""
#
#     edit_data = request.form.get('edit_data')
#     editor_name = request.form.get('editor_name')
#
#     editor_contents = EditableHTML.query.filter_by(
#         editor_name=editor_name).first()
#     if editor_contents is None:
#         editor_contents = EditableHTML(editor_name=editor_name)
#     editor_contents.value = edit_data
#
#     db.session.add(editor_contents)
#     db.session.commit()
#
#     return 'OK', 200
