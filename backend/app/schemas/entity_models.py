from sqlalchemy import Column, BigInteger, Enum, ForeignKey, Text, DateTime, Index, func, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class ChatSession(Base):
    __tablename__ = 'chat_sessions'

    session_id = Column(BigInteger, primary_key=True, autoincrement=True)
    chat_session_id = Column(BigInteger, unique=True, nullable=False)
    customer_id = Column(String(255), nullable=False)
    sense_type = Column(String(255), nullable=False)
    sense_category = Column(String(255), nullable=False)
    started_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    ended_at = Column(DateTime, nullable=True)
    status = Column(Enum('active', 'closed'), default='active')

    __table_args__ = (
        Index('idx_customer_id', 'customer_id'),
    )

    chat_messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    message_id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(BigInteger, ForeignKey('chat_sessions.session_id', ondelete='CASCADE'), nullable=False)
    sender_type = Column(Enum('customer', 'agent', 'bot', 'system'), nullable=False)
    sender_id = Column(String(255), nullable=True)
    query = Column(Text, nullable=False)
    query_response = Column(Text, nullable=True)
    message_type = Column(Enum('input', 'output', 'system'), default='input')
    timestamp = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    session = relationship("ChatSession", back_populates="chat_messages")

    __table_args__ = (
        Index('idx_session_id', 'session_id'),
        Index('idx_timestamp', 'timestamp'),
    )
