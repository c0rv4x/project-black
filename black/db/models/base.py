from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, ForeignKey, Table


Base = declarative_base()

association_table = Table(
    'association', Base.metadata,
    Column('ip_id', String, ForeignKey('ips.ip_id')),
    Column('host_id', String, ForeignKey('hosts.host_id'))
)
