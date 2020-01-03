from app.utils import get_config
from app.email import send_email

template_prefix = 'emails/admin'


def send_join_from_invite_email(user):
    token = user.generate_email_confirmation_token().decode()
    frontend_url = get_config()['FRONTEND_URL']
    invite_link = f"{frontend_url}/sign-up/join-from-invite/{token}"
    send_email(recipient=user.email,
               subject="You Are Invited To Join",
               template=f"{template_prefix}/invite",
               user=user,
               invite_link=invite_link)
