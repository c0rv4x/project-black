import types
import asyncio
import inspect

from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
from sqlalchemy import Column, Integer, ForeignKey, Table


def asyncify(func):
    async def asynced_func(*args, **kwargs):
        return await asyncio.get_event_loop().run_in_executor(None, lambda: func(*args, **kwargs))
    return asynced_func

Base = declarative_base()

association_table = Table(
    'association', Base.metadata,
    Column('ip_id', Integer, ForeignKey('ips.id')),
    Column('host_id', Integer, ForeignKey('hosts.id'))
)
