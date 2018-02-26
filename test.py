from sqlalchemy import desc, or_
from sqlalchemy.orm import aliased, joinedload, subqueryload, contains_eager

from black.black.db import Sessions

from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, ForeignKey, Table
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer



Base = declarative_base()

class TestDatabase(Base):
    """ Keeps data on the found file """
    __tablename__ = "test_1"

    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # A list of files which is associated with the current scope
    qs = relationship('TestQDatabase', cascade="all, delete-orphan", lazy='noload')

    def __repr__(self):
    	return """ <T id=%s len(qs)=%s>""" % (self.id, len(self.qs))

class TestQDatabase(Base):
    """ Keeps data on the found file """
    __tablename__ = "test_2"

    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # The name of the related project
    external_id = Column(
        Integer, ForeignKey('test_1.id', ondelete='CASCADE'), index=True
    )


sessions = Sessions()

ses = sessions.get_new_session()


filtered = ses.query(TestQDatabase).filter(TestQDatabase.id > 10)
filtered_alised = aliased(TestQDatabase, filtered.subquery('filtered_alised'))

request = ses.query(TestDatabase
	).join(filtered_alised
	).options(contains_eager(TestDatabase.qs, alias=filtered_alised)
	)

request_aliased = aliased(TestDatabase, request.subquery('request_aliased'))

res = ses.query(request_aliased
	).join(request_aliased.qs
	).options(contains_eager(request_aliased.qs, alias=filtered_alised)
	).all()
print(res)

sessions.destroy_session(ses)