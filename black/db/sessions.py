import random
from time import sleep
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class Sessions(object):

    def __init__(self):
        self.engine = create_engine('postgresql://black:black101@localhost/black', pool_size=3)

        self.session_builder = sessionmaker(bind=self.engine)

        self.sessions_list = list()

    def get_new_session(self):
        while len(self.sessions_list) == 3:
            sleep(random.random() / 3)

        session = self.session_builder()
        self.sessions_list.append(session)

        return session

    def destroy_session(self, session):
        sessions_by_class = filter(lambda x: x == session, self.sessions_list)

        for session in sessions_by_class:
            session.close()
            self.sessions_list.remove(session)
