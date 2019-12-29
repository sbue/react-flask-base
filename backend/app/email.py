import logging
from flask import render_template

from app.utils import get_config
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_email(recipient, subject, template, **kwargs):
    config = get_config()
    message = Mail(
        from_email=config['EMAIL_SENDER'],
        to_emails=[recipient],
        subject=f"{config['EMAIL_SUBJECT_PREFIX']} {subject}",
        html_content=render_template(f"{template}.html", **kwargs)
    )
    if config['DEBUG'] and not config['SEND_EMAIL_IN_DEV']:
        print(message)
    else:
        sg = SendGridAPIClient(config['SENDGRID_API_KEY'])
        response = sg.send(message)
        response_msg = f"[{response.status_code}] {response.body}"
        if response.status_code > 300:
            logging.error(response_msg)
        else:
            logging.info(response_msg)
