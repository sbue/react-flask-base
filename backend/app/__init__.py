import os
import s3fs

from flask import Flask
from flask_compress import Compress
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from config import configs

basedir = os.path.abspath(os.path.dirname(__file__))

mail = Mail()
compress = Compress()

# Set up configs
config_name = os.getenv('FLASK_CONFIG', 'default')
config = configs[config_name]
config = {k: getattr(config, k) for k in dir(config) if k.isupper()}

# Set up SQLAlchemy

# Set up support for AWS Aurora
# See https://github.com/chanzuckerberg/sqlalchemy-aurora-data-api for more details
connect_args = {}
if all([config.get(k) for k in ['AURORA_CLUSTER_ARN', 'AURORA_SECRET_ARN']]):
    connect_args['aurora_cluster_arn'] = config['AURORA_CLUSTER_ARN']
    connect_args['secret_arn'] = config['AURORA_SECRET_ARN']

engine = create_engine(config['SQLALCHEMY_DATABASE_URI'], connect_args=connect_args)
db_session = scoped_session(sessionmaker(bind=engine,
                                         autocommit=False,
                                         autoflush=False))

Base = declarative_base()
Base.query = db_session.query_property()

# Setup S3 client
s3_fs = s3fs.S3FileSystem()


def create_app():
    app = Flask(__name__)

    app.config.from_object(configs[config_name])
    configs[config_name].init_app(app)

    db_session.configure(bind=engine)

    # release the resources used by a session after each request
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    # Include both www and non-www frontend urls
    origins = [app.config['FRONTEND_URL'],
               app.config['FRONTEND_URL'].replace('https://', 'https://www.')]
    origins = list(set(origins))
    CORS(app, resources={r'/*': {'origins': origins}},
         supports_credentials=True)

    # Set up extensions
    mail.init_app(app)
    compress.init_app(app)

    # Setup the Flask-JWT-Extended extension
    JWTManager(app)

    # Configure SSL if platform supports it
    if not app.config['SSL_DISABLE']:
        from flask_sslify import SSLify
        SSLify(app)

    # Create app blueprints
    from .account.views import account as account_blueprint
    app.register_blueprint(account_blueprint, url_prefix="/account")

    from .admin.views import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix="/admin")

    return app
