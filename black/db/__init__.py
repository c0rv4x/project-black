from .models import *
from .sessions import *

session = get_new_session()
Base.metadata.create_all(engine, checkfirst=True)
destroy_session(session)
