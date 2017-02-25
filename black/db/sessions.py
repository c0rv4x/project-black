from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.orm import sessionmaker


engine = create_engine(
    'postgresql://black:black101@localhost/black', 
    echo=True)

Session_builder = sessionmaker(bind=engine)

sessions = list()

def get_new_session():
    session = Session_builder()
    sessions.append(session)

    return session

def destroy_session(session):
    sessions_by_class = filter(lambda x: x == session, sessions)

    for session in sessions_by_class:
        session.close()
        sessions.remove(session)
