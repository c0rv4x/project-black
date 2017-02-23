""" Models for SQLAlchemy ORM """
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
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

class Scan(Base):
    __tablename__ = 'scans'
    id = Column(String, primary_key=True)
    target = Column(String)
    port_number = Column(Integer)
    protocol = Column(String)
    banner = Column(String)
    screenshot_path = Column(String)
    task_id = Column(String) # Must be foreign key
    project_name = Column(String, ForeignKey('projects.project_name'))

    def __repr__(self):
       return "<Project(project_name='%s'>" % (
                            self.project_name)


session = get_new_session()
Base.metadata.create_all(engine, checkfirst=True)
destroy_session(session)

# class Task(models.Model):
#     """ Task model """
#     task_type = models.CharField(max_length=50)
#     target = models.CharField(max_length=256)
#     params = models.CharField(max_length=1024)
#     previous_scan = models.IntegerField()
#     status = models.CharField(max_length=35)
#     project_name = models.ForeignKey(Project, on_delete=models.CASCADE)


# class Scope(models.Model):
#     """ Scope """
#     hostname = models.CharField(max_length=256)
#     ip_address = models.CharField(max_length=128)
#     project_name = models.CharField(max_length=200)


# class Scan(models.Model):
#     """ Scan """
#     target = models.CharField(max_length=256)
#     port_number = models.IntegerField()
#     protocol = models.CharField(max_length=64)
#     banner = models.CharField(max_length=2048)
#     screenshot_path = models.CharField(max_length=256)
#     task_id = models.ForeignKey(Task, on_delete=models.DO_NOTHING)
#     project_name = models.CharField(max_length=200)

