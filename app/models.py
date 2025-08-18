import uuid
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Boolean, Text
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # 流量单位为字节 (Bytes)
    traffic_limit = Column(BigInteger, default=100 * 1024 * 1024 * 1024) # 默认 100GB
    traffic_used = Column(BigInteger, default=0)
    
    due_date = Column(DateTime, nullable=True)
    
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(100), nullable=False)
    port = Column(Integer, nullable=False)
    protocol = Column(String(50), nullable=False) # 例如: vless, vmess
    
    # 以 JSON 格式存储节点的详细配置
    config_details = Column(Text, nullable=True) 
    
    is_active = Column(Boolean, default=True)
