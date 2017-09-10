from .models import *
from .sessions import *


engine = create_engine(
    'postgresql://black:black101@localhost/black')

# Session_builder = sessionmaker(bind=engine)

# session = get_new_session()
Base.metadata.create_all(engine, checkfirst=True)
# destroy_session(session)
