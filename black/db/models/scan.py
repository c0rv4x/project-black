import datetime
from black.black.db.models.base import Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer


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

    # # Path to the screenshot image
    # screenshot_path = Column(String)

    # ID of the related task (the task, which resulted in the current data)
    task_id = Column(String, ForeignKey('tasks.task_id'))

    # The name of the related project
    project_uuid = Column(
        String, ForeignKey('projects.project_uuid', ondelete='CASCADE')
    )

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)
    # def __repr__(self):
    #    return "<Scan(project_uuid='%s'>" % (
    #                         self.project_uuid)
