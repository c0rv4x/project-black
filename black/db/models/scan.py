import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, UniqueConstraint

from .base import Base


class ScanDatabase(Base):
    """ Keep the major part of data: everything that has been
    found during the scan """
    __tablename__ = 'scans'
    __table_args__ = (
        UniqueConstraint('target', 'port_number', 'project_uuid'),
    )

    # Primary key (probably uuid4)
    scan_id = Column(String, primary_key=True)

    # The name of the related project
    target = Column(
        Integer, ForeignKey('ips.id', ondelete='CASCADE')
    )

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
        Integer, ForeignKey('projects.project_uuid', ondelete='CASCADE'), index=True
    )

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


    def dict(self):
        return {        
            "scan_id": self.scan_id,
            "target": self.target,
            "port_number": self.port_number,
            "protocol": self.protocol,
            "banner": self.banner,
            "task_id": self.task_id,
            "project_uuid": self.project_uuid
        }

    def __repr__(self):
       return "<Scan(port_number='%s'>" % (self.port_number)
