import os


class Config:
    APP_NAME = os.getenv("APP_NAME", "Flask-Base")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

    for secret_key in ["SECRET_KEY", "JWT_SECRET_KEY"]:
        if os.getenv(secret_key):
            SECRET_KEY = os.getenv(secret_key)
        else:
            SECRET_KEY = "SECRET_KEY_ENV_VAR_NOT_SET"
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True

    # Email
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")

    # Analytics
    GOOGLE_ANALYTICS_ID = os.getenv("GOOGLE_ANALYTICS_ID", "")
    SEGMENT_API_KEY = os.getenv("SEGMENT_API_KEY", "")

    # Admin account
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "password")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")
    EMAIL_SUBJECT_PREFIX = "[{}]".format(APP_NAME)
    EMAIL_SENDER = "{app_name} Admin <{email}>".format(
        app_name=APP_NAME, email=MAIL_DEFAULT_SENDER)

    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True

    @staticmethod
    def init_app(app):
        pass


basedir = os.path.abspath(os.path.dirname(__file__))


class DevelopmentConfig(Config):
    DEBUG = True
    ASSETS_DEBUG = True
    SQLALCHEMY_DATABASE_URI = f"sqlite:///" \
                              f"{os.path.join(basedir, 'data-dev.sqlite')}"
    JWT_COOKIE_SECURE = False

    @classmethod
    def init_app(cls, app):
        app.logger.info("THIS APP IS IN DEBUG MODE."
                        "YOU SHOULD NOT SEE THIS IN PRODUCTION.")


class StagingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "STAGING_DATABASE_URL",
        f"sqlite:///{os.path.join(basedir, 'data-staging.sqlite')}"
    )

    @classmethod
    def init_app(cls, app):
        app.logger.warning("THIS APP IS IN TESTING MODE. YOU SHOULD NOT SEE "
                           "THIS IN PRODUCTION.")


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = f"postgresql://{os.getenv('DB_USERNAME')}:" \
                              f"{os.getenv('DB_PASSWORD')}" \
                              f"@{os.getenv('DB_ENDPOINT')}"
    SSL_DISABLE = (os.getenv("SSL_DISABLE", "True") == "True")

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        assert os.getenv("SECRET_KEY") != "SECRET_KEY_ENV_VAR_NOT_SET"
        assert os.getenv("JWT_SECRET_KEY") != "SECRET_KEY_ENV_VAR_NOT_SET"


config = {
    "development": DevelopmentConfig,
    "staging": StagingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}