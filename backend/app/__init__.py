import os
import logging

from flask import Flask
from flask_compress import Compress
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from config import config as Config

basedir = os.path.abspath(os.path.dirname(__file__))

mail = Mail()
db = SQLAlchemy()
compress = Compress()


def create_app(config):
    app = Flask(__name__)

    config_name = config

    if not isinstance(config, str):
        config_name = os.getenv('FLASK_CONFIG', 'default')

    app.config.from_object(Config[config_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # not using sqlalchemy event system, hence disabling it

    Config[config_name].init_app(app)

    CORS(app, resources={r'/*': {'origins': f"{app.config['FRONTEND_URL']}"}},
         supports_credentials=True)

    # Set up extensions
    mail.init_app(app)
    db.init_app(app)
    compress.init_app(app)

    # Setup the Flask-JWT-Extended extension
    JWTManager(app)

    # Setup logging
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Configure SSL if platform supports it
    if not app.debug and not app.testing and not app.config['SSL_DISABLE']:
        from flask_sslify import SSLify
        SSLify(app)

    # Create app blueprints
    from .auth.views import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix="/auth")

    from .admin.views import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix="/admin")

    return app
