import os
from app import create_app
from app.email import send_email


def send_join_from_invite_email(user):
    app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    with app.app_context():
        token = user.generate_email_confirmation_token().decode()
        frontend_url = app.config['FRONTEND_URL']
        invite_link = f"{frontend_url}/sign-up/join-from-invite/{token}"
        send_email(recipient=user.email,
                   subject='You Are Invited To Join',
                   template='emails/invite',
                   user=user,
                   invite_link=invite_link)
