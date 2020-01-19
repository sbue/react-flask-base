import os

basedir = os.path.abspath(os.path.dirname(__file__))

# TODO: replace with dotenv
if os.path.exists('config.env'):
    print('Importing environment from config.env file')
    for line in open('config.env'):
        var = line.strip().split('=')
        if len(var) == 2:
            os.environ[var[0]] = var[1].replace("\"", "")


class Config:
    APP_NAME = os.getenv('APP_NAME', 'Flask-Base')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

    for secret_key in ['SECRET_KEY', 'JWT_SECRET_KEY']:
        if os.getenv(secret_key):
            SECRET_KEY = os.getenv(secret_key)
        else:
            SECRET_KEY = "SECRET_KEY_ENV_VAR_NOT_SET"

    # Email
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')

    # Analytics
    GOOGLE_ANALYTICS_ID = os.getenv("GOOGLE_ANALYTICS_ID", "")
    SEGMENT_API_KEY = os.getenv("SEGMENT_API_KEY", "")

    # Admin account
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'password')
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@example.com')
    EMAIL_SUBJECT_PREFIX = "[{}]".format(APP_NAME)
    EMAIL_SENDER = "{app_name} Admin <{email}>".format(
        app_name=APP_NAME, email=MAIL_DEFAULT_SENDER)

    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SAMESITE = 'Strict'
    JWT_COOKIE_DOMAIN = os.getenv('JWT_COOKIE_DOMAIN', None)

    S3_BUCKET = os.getenv('S3_BUCKET', None)

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    ASSETS_DEBUG = True
    SQLALCHEMY_DATABASE_URI = \
        f"sqlite:///{os.path.join(basedir, 'data-dev.sqlite')}"
    JWT_COOKIE_SECURE = False
    SEND_EMAIL_IN_DEV = os.getenv('SEND_EMAIL_IN_DEV', 'False') == 'True'
    SSL_DISABLE = True

    @classmethod
    def init_app(cls, app):
        app.logger.info("THIS APP IS IN DEBUG MODE."
                        "YOU SHOULD NOT SEE THIS IN PRODUCTION.")


class ProductionConfig(Config):
    port = f":{os.getenv('DB_PORT')}" if 'DB_PORT' in os.environ else ""
    db_name = f"/{os.getenv('DB_NAME')}" if 'DB_NAME' in os.environ else ""
    SQLALCHEMY_DATABASE_URI = f"{os.getenv('DB_DIALECT', '')}://" \
                              f"{os.getenv('DB_USERNAME', '')}:" \
                              f"{os.getenv('DB_PASSWORD', '')}@" \
                              f"{os.getenv('DB_ENDPOINT', '')}" \
                              f"{port}" \
                              f"{db_name}"

    AURORA_CLUSTER_ARN = os.getenv('AURORA_CLUSTER_ARN')
    AURORA_SECRET_ARN = os.getenv('AURORA_SECRET_ARN')

    SSL_DISABLE = False
    JWT_COOKIE_SECURE = True

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        assert os.getenv("SECRET_KEY") != "SECRET_KEY_ENV_VAR_NOT_SET"
        assert os.getenv("JWT_SECRET_KEY") != "SECRET_KEY_ENV_VAR_NOT_SET"


class StagingConfig(ProductionConfig):
    TESTING = True
    JWT_COOKIE_SECURE = False
    SSL_DISABLE = True

    @classmethod
    def init_app(cls, app):
        app.logger.warning("THIS APP IS IN STAGING MODE. YOU SHOULD NOT SEE "
                           "THIS IN PRODUCTION.")


configs = {
    "development": DevelopmentConfig,
    "staging": StagingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
