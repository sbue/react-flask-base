from enum import Enum as EnumMeta
from datetime import datetime
import logging
from flask import current_app
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import Column, Integer, String, Enum, Boolean

from app import Base, s3_fs, db_session, config
from app.utils import deserialize_data
from app.constants import PROFILE_PHOTOS_DIR, SEVEN_DAYS_EXPIRATION


class Role(EnumMeta):
    ADMIN = 'Admin'
    USER = 'User'

    @staticmethod
    def get_roles():  # Returns string names, ie ["Admin"...]
        return [role.value for role in Role]


class User(UserMixin, Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    role = Column(Enum(Role), index=True, default=Role.USER)
    first_name = Column(String(64), index=True)
    last_name = Column(String(64), index=True)
    email = Column(String(64), unique=True, index=True)
    password_hash = Column(String(128))
    verified_email = Column(Boolean, default=False)
    profile_photo_s3_key = Column(String(128))

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def is_admin(self):
        return self.role == Role.ADMIN

    @property
    def password(self):
        raise AttributeError('`password` is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_email_confirmation_token(self, expiration=604800):
        """Generate a confirmation token to email a new user."""
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        ts = int(datetime.now().timestamp())
        return s.dumps({'id': self.id, 'ts': ts})

    def generate_email_change_token(self, new_email, expiration=3600):
        """Generate an email change token to email an existing user."""
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        ts = int(datetime.now().timestamp())
        return s.dumps({'id': self.id, 'new_email': new_email, 'ts': ts})

    def generate_password_reset_token(self, expiration=3600):
        """
        Generate a password reset change token to email to an existing user.
        """
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        ts = int(datetime.now().timestamp())
        return s.dumps({'id': self.id, 'ts': ts})

    def verify_email(self, token):
        """Verify that the provided token is for this user's id."""
        data = deserialize_data(token)
        if not data:
            logging.warning(f"Error verifying email for user "
                            f"id {self.id}: BadSignature or SignatureExpired")
            return False
        if data.get('id') != self.id:
            logging.warning(f"Error verifying email for user "
                            f"id {self.id}: {data}")
        self.verified_email = True
        db_session.add(self)
        db_session.commit()
        return True

    def change_email(self, token):
        pass  # TODO:

    def upload_profile_photo(self, file):
        db_session.add(self)
        s3_dir = PROFILE_PHOTOS_DIR.format(bucket=config['S3_BUCKET'], id=self.id)
        s3_key = f'{s3_dir}/{file.filename}'
        if s3_fs.exists(s3_dir):  # Remove existing folder
            s3_fs.rm(s3_dir)
        with s3_fs.open(s3_key, 'wb') as s3_fp:
            s3_fp.write(file.read())
            self.profile_photo_s3_key = s3_key
        db_session.add(self)
        db_session.commit()
        return s3_key

    def profile_photo_url(self):
        if self.profile_photo_s3_key:
            return s3_fs.url(self.profile_photo_s3_key,
                             expires=SEVEN_DAYS_EXPIRATION)  # 7 Days

    def clean(self):
        if self.profile_photo_s3_key:
            s3_dir = PROFILE_PHOTOS_DIR.format(bucket=config['S3_BUCKET'], id=self.id)
            s3_fs.rm(s3_dir)

    @staticmethod
    def reset_password(token, new_password):
        """Verify the new password for this user."""
        data = deserialize_data(token)
        if data is None:
            logging.warning(f"Error reseting password: BadSignature or "
                            f"SignatureExpired")
            return None
        user_id = data.get('id')
        user = db_session.query(User).filter_by(id=user_id).first()
        if user is None:
            logging.warning(f"User with id {user_id} does not exist.")
            return None
        user.password = new_password
        db_session.add(user)
        db_session.commit()
        return user

    @staticmethod
    def generate_fake(count=100, **kwargs):
        """Generate a number of fake users for testing."""
        from sqlalchemy.exc import IntegrityError
        from random import seed, choice
        from faker import Faker

        fake = Faker()

        seed()
        for i in range(count):
            u = User(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password='password',
                verified_email=True,
                role=choice([r for r in Role]),
                **kwargs)
            db_session.add(u)
            try:
                db_session.commit()
            except IntegrityError:
                db_session.rollback()

    def __repr__(self):
        return '<User \'%s\'>' % self.full_name()
