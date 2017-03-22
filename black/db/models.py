""" Models for SQLAlchemy ORM """
import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

class Project(Base):
    """ Kepps the names of all the projects that exist
    in the system """
    __tablename__ = 'projects'

    # ID of the project (uuid for now)
    project_uuid = Column(String, primary_key=True)

    # Given name
    project_name = Column(String)

    # Really crucial comment field
    comment = Column(String)

    # Just Date
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    # Some relationships
    scopes_relationship = relationship('Scope', cascade="all, delete-orphan")
    tasks_relationship = relationship('Task', cascade="all, delete-orphan")
    scans_relationship = relationship('Scan', cascade="all, delete-orphan")

    def __repr__(self):
       return "<Project(project_name='%s'>" % (
                            self.project_name)


class Task(Base):
    """ Keeps the data of all the tasks that ever existed
    in the system (though not the deleted ones) """
    __tablename__ = 'tasks'

    # Primary key (uuid4)
    task_id = Column(String, primary_key=True)

    # Literal name of the task: dnsscan, nmap etc.
    task_type = Column(String)

    # Target can be: hostname, ip, URL 
    #    (depending on the task_type)
    target = Column(String)

    # Params of the lanuched task (flags, dictionaries etc.)
    params = Column(String)

    # {New, Working, Finished, Aborted, ...}
    status = Column(String)

    # Progress in percents
    progress = Column(Integer)

    # Special note. E.x. error
    text = Column(String)

    # Time of adding
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    # The name of the related project
    project_uuid = Column(String, ForeignKey('projects.project_uuid', ondelete='CASCADE'))

    # def __repr__(self):
    #    return "<Task(task_id='%s', task_type='%s',)>" % (
    #                         self.project_uuid)


class Scope(Base):
    """ Kepps the data on scope:
    * Hostnames
    * IPs
    * Related data (like, 'scope_id' and the project name)  """
    __tablename__ = 'scopes'

    # Primary key (probably uuid4)
    scope_id = Column(String, primary_key=True)

    # The hostname can be either string or None
    hostname = Column(String)

    # IP address is a string (probably None, but not sure if 
    #    is needed)
    ip_address = Column(String)

    # The name of the related project
    project_uuid = Column(String, ForeignKey('projects.project_uuid', ondelete="CASCADE"))

    # References the task that got this record
    # Default is None, as scope can be given by the user manually.
    task_id = Column(String, ForeignKey('tasks.task_id', ondelete='SET NULL'), default=None)

    # Date of adding
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
       return """<Scope(scope_id='%s', hostname='%s',
                        ip_address='%s', project_uuid='%s')>""" % (
                        self.scope_id, self.hostname,
                        self.ip_address, self.project_uuid)


class Scan(Base):
    """ Keep the major part of data: everything that has been
    found during the scan """
    __tablename__ = 'scans'

    # Primary key (probably uuid4)
    scan_id = Column(String, primary_key=True)

    # Target is (probably) host/ip
    target = Column(String)

    # TCP port number
    port_number = Column(Integer)

    # The network protocol (tcp, udp ...) of the port
    protocol = Column(String)

    # Banner that was received from Nmap
    banner = Column(String)

    # Path to the screenshot image
    screenshot_path = Column(String)

    # ID of the related task (the task, which resulted in the current data)
    # TODO: should think about the following:
    #    many scans can update one record, should we store all the ids?
    tasks_ids = Column(String) # TODO: add on_delete

    # The name of the related project
    project_uuid = Column(String, ForeignKey('projects.project_uuid', ondelete='CASCADE'))

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)
    # def __repr__(self):
    #    return "<Scan(project_uuid='%s'>" % (
    #                         self.project_uuid)


# class Screenshot(Base):
#     """ Keeps the data on the screenshots. Referneces to Scope"""
#     __tablename__ = 'screenshots'

#     # Primary key
#     screenshot_id = Column(String, primary_key=True)

#     # Referneces the task that made this screenshot
#     task_id = Columns(String, ForeignKey('tasks.task_id', ondelete='SET NULL'))

#     # Refenreces the host data, using which, the screenshot was captured
#     scope = Columns(String, ForeignKey('scopes.scope_id'), ondelete='CASCADE')

#     # Date of added
#     date_added = Column(DateTime, default=datetime.datetime.utcnow)