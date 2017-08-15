import random
from time import sleep
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.orm import sessionmaker


engine = create_engine(
    'postgresql://black:black101@localhost/black')

Session_builder = sessionmaker(bind=engine)

sessions_list = list()

def get_new_session():
    while len(sessions_list) == 5:
        sleep(random.random() / 3)

    session = Session_builder()
    sessions_list.append(session)

    return session

def destroy_session(session):
    sessions_by_class = filter(lambda x: x == session, sessions_list)

    for session in sessions_by_class:
        session.close()
        sessions_list.remove(session)
