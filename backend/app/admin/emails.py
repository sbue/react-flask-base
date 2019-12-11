from app.email import send_email


def send_join_from_invite_email(user, frontend_url):
    token = user.generate_email_confirmation_token().decode()
    invite_link = f"{frontend_url}/sign-up/join-from-invite/{token}"
    send_email(recipient=user.email,
               subject='You Are Invited To Join',
               template='emails/invite',
               user=user,
               invite_link=invite_link)
