import os

from flask import render_template

from app import create_app

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from zappa.asynchronous import task


@task
def send_email(recipient, subject, template, **kwargs):
    app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    with app.app_context():
        message = Mail(
            from_email=app.config['EMAIL_SENDER'],
            to_emails=[recipient],
            subject=f"{app.config['EMAIL_SUBJECT_PREFIX']} {subject}",
            html_content=render_template(f"{template}.html", **kwargs)
        )
        if app.debug and not app.config['SEND_EMAIL_IN_DEV']:
            print(message)
        else:
            sg = SendGridAPIClient(app.config['SENDGRID_API_KEY'])
            response = sg.send(message)
            response_msg = f"[{response.status_code}] {response.body}"
            if response.status_code > 300:
                app.logger.error(response_msg)
            else:
                app.logger.info(response_msg)
