from enum import Enum
from datetime import datetime
import logging
from flask import current_app
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from werkzeug.security import check_password_hash, generate_password_hash

from .. import db
from app.utils import deserialize_data


class Role(Enum):
    ADMIN = 'Admin'
    USER = 'User'

    @staticmethod
    def get_roles():  # Returns string names, ie ["Admin"...]
        return [role.value for role in Role]


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum(Role), index=True, default=Role.USER)
    first_name = db.Column(db.String(64), index=True)
    last_name = db.Column(db.String(64), index=True)
    email = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    verified_email = db.Column(db.Boolean, default=False)

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
        db.session.add(self)
        db.session.commit()
        return True

    def change_email(self, token):
        pass  # TODO:

    @staticmethod
    def reset_password(token, new_password):
        """Verify the new password for this user."""
        data = deserialize_data(token)
        if data is None:
            logging.warning(f"Error reseting password: BadSignature or "
                            f"SignatureExpired")
            return None
        user_id = data.get('id')
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            logging.warning(f"User with id {user_id} does not exist.")
            return None
        user.password = new_password
        db.session.add(user)
        db.session.commit()
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
                role=choice([r for r in Role if r != Role.ANONYMOUS]),
                **kwargs)
            db.session.add(u)
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()

    def __repr__(self):
        return '<User \'%s\'>' % self.full_name()
