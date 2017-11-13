from .sessions import Sessions
from .models.base import Base, association_table
from .models.ip import IPDatabase
from .models.host import HostDatabase
from .models.project import ProjectDatabase
from .models.task import TaskDatabase


sessions = Sessions()
Base.metadata.create_all(sessions.engine, checkfirst=True)
