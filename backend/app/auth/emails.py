import os
from app import create_app
from app.email import send_email
from app.utils import get_config


def send_confirm_email(user):
    app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    with app.app_context():
        token = user.generate_email_confirmation_token().decode()  # TODO: remove me
        frontend_url = get_config()['FRONTEND_URL']
        confirm_link = f"{frontend_url}/sign-up/pending-confirm-email/{token}"
        send_email(recipient=user.email,
                   subject='Confirm Your Account',
                   template='emails/confirm_email',
                   user=user,
                   confirm_link=confirm_link)


def send_reset_password_email(user, next):
    token = user.generate_password_reset_token().decode()
    frontend_url = get_config()['FRONTEND_URL']
    reset_link = f"{frontend_url}/login/reset-password/{token}"
    send_email(recipient=user.email,
               subject="Reset Your Password",
               template="emails/reset_password",
               user=user,
               reset_link=reset_link,
               next=next)
