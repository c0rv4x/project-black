from .models import *
from .sessions import Sessions


sessions = Sessions()
Base.metadata.create_all(sessions.engine, checkfirst=True)
