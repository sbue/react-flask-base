from app import config
from app.email import send_email

template_prefix = 'emails/account'


def send_confirm_email(user):
    token = user.generate_email_confirmation_token().decode()
    frontend_url = config['FRONTEND_URL']
    confirm_link = f"{frontend_url}/sign-up/pending-confirm-email/{token}"
    send_email(recipient=user.email,
               subject="Confirm Your Account",
               template=f"{template_prefix}/confirm_email",
               user=user,
               confirm_link=confirm_link)


def send_reset_password_email(user, next):
    token = user.generate_password_reset_token().decode()
    frontend_url = config['FRONTEND_URL']
    reset_link = f"{frontend_url}/login/reset-password/{token}"
    send_email(recipient=user.email,
               subject="Reset Your Password",
               template=f"{template_prefix}/reset_password",
               user=user,
               reset_link=reset_link,
               next=next)


def send_change_email(user):
    token = user.generate_email_confirmation_token().decode()
    frontend_url = config['FRONTEND_URL']
    change_email_link = f"{frontend_url}/sign-up/pending-confirm-email/{token}"
    send_email(recipient=user.email,
               subject="Confirm Your New Email",
               template=f"{template_prefix}/change_email",
               user=user,
               change_email_link=change_email_link)
