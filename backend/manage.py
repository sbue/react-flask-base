#!/usr/bin/env python
import subprocess

# from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand

from app import create_app, engine, Base, db_session, config
from app.models.user import User, Role

app = create_app()
manager = Manager(app)


# HACK: db object for Flask-migrate
class DB:
    def __init__(self, metadata):
        self.metadata = metadata


db = DB(Base.metadata)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, session=db_session)


manager.add_command('shell', Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """Run the unit tests."""
    import unittest

    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


@manager.command
def recreate_db():
    """
    Recreates a local database. You probably should not use this on
    production.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db_session.commit()


@manager.option(
    '-n',
    '--number-users',
    default=10,
    type=int,
    help='Number of each model type to create',
    dest='number_users')
def add_fake_data(number_users):
    """
    Adds fake data to the database.
    """
    User.generate_fake(count=number_users)


@manager.command
def setup_dev():
    """Runs the set-up needed for local development."""
    setup_general()


@manager.command
def setup_prod():
    """Runs the set-up needed for production."""
    setup_general()


def setup_general():
    """Runs the set-up needed for both local development and production.
       Also sets up first admin user."""
    if User.query.filter_by(email=config['ADMIN_EMAIL']).first() is None:
        user = User(
            role=Role.ADMIN,
            first_name='Admin',
            last_name='Account',
            password=config['ADMIN_PASSWORD'],
            email=config['ADMIN_EMAIL'],
            verified_email=True,
        )
        db_session.add(user)
        db_session.commit()
        print('Added administrator {}'.format(user.full_name()))


@manager.command
def format():
    """Runs the yapf and isort formatters over the project."""
    isort = 'isort -rc *.py app/'
    yapf = 'yapf -r -i *.py app/'

    print('Running {}'.format(isort))
    subprocess.call(isort, shell=True)

    print('Running {}'.format(yapf))
    subprocess.call(yapf, shell=True)


if __name__ == '__main__':
    manager.run()
