from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, ForeignKey, Table


Base = declarative_base()

association_table = Table(
    'association', Base.metadata,
    Column('ip_id', Integer, ForeignKey('ips.id')),
    Column('host_id', Integer, ForeignKey('hosts.id'))
)
