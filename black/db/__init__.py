from black.black.db.sessions import Sessions
from black.black.db.models.base import Base
from managers.projects.project_inner import ProjectInner

# from black.black.db.models.host import HostInternal
# from black.black.db.models.ip import IP
# from .sessions import Sessions


sessions = Sessions()
Base.metadata.create_all(sessions.engine, checkfirst=True)
