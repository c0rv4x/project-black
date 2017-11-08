import datetime
from black.black.db.models.base import Base
from sqlalchemy import Column, String, DateTime, ForeignKey


class IP_addr(Base):
    """ Kepps the data on scope:
    * Hostnames
    * IPs
    * Related data (like, 'scope_id' and the project name)  """
    __tablename__ = "ips"

    # Primary key (probably uuid4)
    ip_id = Column(String, primary_key=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    ip_address = Column(String)

    # Comment field, as requested by VI
    comment = Column(String, default="")

    # The name of the related project
    project_uuid = Column(
        String, ForeignKey('projects.project_uuid', ondelete="CASCADE")
    )

    # References the task that got this record
    # Default is None, as scope can be given by the user manually.
    task_id = Column(
        String, ForeignKey('tasks.task_id', ondelete='SET NULL'), default=None
    )

    # Date of adding
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return """<IP_addr(ip_id='%s', hostname='%s',
                        ip_address='%s', project_uuid='%s')>""" % (
            self.ip_id, self.hostnames, self.ip_address, self.project_uuid
        )
