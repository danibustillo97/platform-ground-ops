from sqlalchemy import Column, Integer, String
from .db import Base


class Role(Base):
    __tablename__ = "Tbl_Roles_Ground_Ops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
