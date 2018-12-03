import asyncio

from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, ForeignKey, Table


Base = declarative_base()

association_table = Table(
    'association', Base.metadata,
    Column('ip_id', Integer, ForeignKey('ips.id')),
    Column('host_id', Integer, ForeignKey('hosts.id'))
)


class Async:
    def __init__(self):
        

# def asyncify(func):
#     async def async_func(*args, **kwargs):
#         return await asyncio.get_event_loop().run_in_executor(None, func(*args, **kwargs))

#     return async_func
