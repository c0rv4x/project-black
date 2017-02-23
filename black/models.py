""" Models for SQLAlchemy ORM """
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


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

Base = declarative_base()

class Project(Base):
    __tablename__ = 'projects'
    project_name = Column(String, primary_key=True)

    def __repr__(self):
       return "<Project(project_name='%s'>" % (
                            self.project_name)

session = get_new_session()

Base.metadata.create_all(engine, checkfirst=True)

destroy_session(session)
