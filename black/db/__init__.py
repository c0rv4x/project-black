from .sessions import Sessions
from black.black.db.models.base import Base, association_table
from black.black.db.models.ip import IPDatabase
from black.black.db.models.host import HostDatabase
from black.black.db.models.project import ProjectDatabase
from black.black.db.models.task import TaskDatabase


sessions = Sessions()
Base.metadata.create_all(sessions.engine, checkfirst=True)
