import random
from time import sleep
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from contextlib import contextmanager

from config import CONFIG


class Sessions(object):
    def __init__(self):
        self.engine = create_engine(
            'postgresql+psycopg2://{}:{}@{}:{}/{}'.format(
                CONFIG['postgres']['username'],
                CONFIG['postgres']['password'],
                CONFIG['postgres']['host'],
                CONFIG['postgres']['port'],
                CONFIG['postgres']['database']
            ),
            # echo=True,
            use_batch_mode=True)
        self.session_builder = sessionmaker(
            bind=self.engine, expire_on_commit=False)

    def get_new_session(self):
        session = self.session_builder()

        return session

    def destroy_session(self, session):
        session.close()

    @contextmanager
    def get_session(self):
        """ Easy to use session manager """
        if self.session_builder is None:
            raise Exception('Sessionmaker is not initialized.')
        session = self.session_builder()

        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
