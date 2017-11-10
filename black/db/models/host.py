import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from black.black.db.models.base import Base, association_table


class HostDatabase(Base):
    """ Keeps hosts that point to relative IPs """
    __tablename__ = 'hosts'

    # Primary key (probably uuid4)
    host_id = Column(String, primary_key=True)

    # Hostname (dns record-like)
    hostname = Column(String)

    # IP addresses of that host
    ip_addresses = relationship("IPDatabase", secondary=association_table, back_populates="hostnames")

    # Some text comment
    comment = Column(String)

    # ID of the related task (the task, which resulted in the current data)
    task_id = Column(String, ForeignKey('tasks.task_id'))

    # The name of the related project
    project_uuid = Column(String, ForeignKey('projects.project_uuid', ondelete='CASCADE'))

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)


    def __repr__(self):
        return """<HostDatabase(host_id='%s', hostname='%s',
                        ip_addresses='%s', project_uuid='%s')>""" % (
            self.host_id, self.hostname, self.ip_addresses, self.project_uuid
        )
