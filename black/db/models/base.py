import types
import asyncio
import inspect

from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
from sqlalchemy import Column, Integer, ForeignKey, Table


def wrap(func):
    async def outer(*args, **kwargs):
        print("PRE")
        return await asyncio.get_event_loop().run_in_executor(None, func, *args, **kwargs)
        return return_value
    return outer

class Async:
    def async_patch(cls):
        methods_to_patch = []

        for method_name in dir(cls):
            if (
                not method_name.startswith('_') and
                callable(getattr(cls, method_name)) # and
                # method_name != 'wrap'
            ):
                methods_to_patch.append(method_name)

        for method_name in methods_to_patch:
            print(method_name)
            setattr(cls, method_name, wrap(getattr(cls, method_name)))

        # return super(Async, cls).__new__(cls)
        return cls

Base = declarative_base()

association_table = Table(
    'association', Base.metadata,
    Column('ip_id', Integer, ForeignKey('ips.id')),
    Column('host_id', Integer, ForeignKey('hosts.id'))
)


# def asyncify(func):
#     async def async_func(*args, **kwargs):
#         return await asyncio.get_event_loop().run_in_executor(None, func(*args, **kwargs))

#     return async_func
