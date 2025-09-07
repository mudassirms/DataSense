from app.schemas.entity_models import ChatMessage
from app.schemas.entity_models import ChatSession
from app.schemas.entity_models import Base
from typing import List
import app.schemas.database as database


class ChatHistoryRepository:
    def __init__(self, dbName):
        self.dbName = dbName

    def create_(self, entity: Base):
        session = database.get_session_by_db_name(self.dbName)
        try:
            session.add(entity)
            session.commit()
            session.refresh(entity)
            return entity
        finally:
            session.close()

    def get_chat_session(self, chat_session_id: int) -> ChatSession:
        session = database.get_session_by_db_name(self.dbName)
        try:
            chat_session = session.query(ChatSession).filter(ChatSession.chat_session_id == chat_session_id).first()
            return chat_session
        finally:
            session.close()

    def get_sessions_by_type(self, sense_type: str) -> List[ChatSession]:
        session = database.get_session_by_db_name(self.dbName)
        try:
            return session.query(ChatSession).filter(ChatSession.sense_type == sense_type).all()
        finally:
            session.close()

    def get_sessions_by_type_category(self, sense_type: str, sense_category: str) -> List[ChatSession]:
        session = database.get_session_by_db_name(self.dbName)
        try:
            return session.query(ChatSession).filter(ChatSession.sense_type == sense_type).filter(
                ChatSession.sense_category == sense_category).all()
        finally:
            session.close()

    def get_sessions_by_type_category_customer_id(self, sense_type: str, sense_category: str, customer_id: str) -> List[
        ChatSession]:
        session = database.get_session_by_db_name(self.dbName)
        try:
            return (session.query(ChatSession)
                    .filter(ChatSession.sense_type == sense_type)
                    .filter(ChatSession.customer_id == customer_id)
                    .filter(ChatSession.sense_category == sense_category)
                    .all())
        finally:
            session.close()

    def get_chat_messages_by_session(self, session_id: int) -> List[ChatMessage]:
        session = database.get_session_by_db_name(self.dbName)
        try:
            return session.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()
        finally:
            session.close()

    def get_chat_session_by_id(self, session_id: int) -> ChatSession:
        session = database.get_session_by_db_name(self.dbName)
        try:
            return session.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        finally:
            session.close()

    def update_chat_session_status(self, session_id: int, status: str) -> ChatSession:
        session = database.get_session_by_db_name(self.dbName)
        try:
            chat_session = session.query(ChatSession).filter(ChatSession.session_id == session_id).first()
            if chat_session:
                chat_session.status = status
                session.commit()
                session.refresh(chat_session)
            return chat_session
        finally:
            session.close()

    def delete_chat_session(self, session_id: int) -> ChatSession:
        session = database.get_session_by_db_name(self.dbName)
        try:
            chat_session = session.query(ChatSession).filter(ChatSession.session_id == session_id).first()
            if chat_session:
                session.delete(chat_session)
                session.commit()
                return chat_session
            return None
        finally:
            session.close()

    def update_chat_message_response(self, chat_message_id: int, query_response: str) -> ChatMessage:
        session = database.get_session_by_db_name(self.dbName)
        try:
            chat_message = session.query(ChatMessage).filter(ChatMessage.message_id == chat_message_id).first()
            if chat_message:
                chat_message.query_response = query_response
                session.commit()
                session.refresh(chat_message)
            return chat_message
        finally:
            session.close()

    def execute_query(self, query):
        session = database.get_session_by_db_name(self.dbName)
        try:
            data = session.execute(query).fetchall()
            return data
        finally:
            session.close()
