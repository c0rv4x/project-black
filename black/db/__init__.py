from .sessions import Sessions
from .models.base import Base, association_table
from .models.project import ProjectDatabase
from .models.ip import IPDatabase
from .models.host import HostDatabase
from .models.task import TaskDatabase
from .models.scan import ScanDatabase
from .models.file import FileDatabase
from .models.cred import CredDatabase

sessions = Sessions()
Base.metadata.create_all(sessions.engine, checkfirst=True)
