from app.email import send_email
from app.models.user import User


def send_confirm_email(user, frontend_url):
    token = User.generate_email_confirmation_token(user.id).decode()  # TODO: remove me
    confirm_link = f"{frontend_url}/sign-up/pending-confirm-email/{token}"
    send_email(recipient=user.email,
               subject='Confirm Your Account',
               template='emails/confirm_email',
               user=user,
               confirm_link=confirm_link)


def send_reset_password_email(user, frontend_url, next):
    token = user.generate_password_reset_token().decode()
    reset_link = f"{frontend_url}/login/reset-password/{token}"
    send_email(recipient=user.email,
               subject="Reset Your Password",
               template="emails/reset_password",
               user=user,
               reset_link=reset_link,
               next=next)
