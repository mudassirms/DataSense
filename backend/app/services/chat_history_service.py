import logging
from typing import List

from app.models.request_response_models import AskRequest
from app.schemas.entity_models import ChatMessage
from app.schemas.entity_models import ChatSession
import app.helper.mvx_helper as mvx_helper
from app.repositories.chat_history_repository import ChatHistoryRepository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChatHistoryService:
    def __init__(self, dbName):
        self.repo = ChatHistoryRepository(dbName)

    def create_chat_session(self, customer_id: str, sense_type: str,
                            sense_category: str,
                            chat_session_id: int) -> ChatSession:
        chat_session = self.repo.get_chat_session(chat_session_id=chat_session_id)
        if chat_session is None:
            chat_session = ChatSession(
                chat_session_id=chat_session_id,
                customer_id=customer_id,
                sense_type=sense_type,
                sense_category=sense_category
            )
        return self.repo.create_(chat_session)

    def create_chat_message(self, session_id: int, sender_type: str, message_text: str,
                            sender_id: str = None) -> ChatMessage:
        chat_message = ChatMessage(
            session_id=session_id,
            sender_type=sender_type or "bot",
            query=message_text,
            sender_id=sender_id or "test123"
        )
        return self.repo.create_(chat_message)

    def get_sessions_by_type(self, sense_type: str) -> List[ChatSession]:
        return self.repo.get_sessions_by_type(sense_type)

    def get_sessions_by_type_category(self, sense_type: str, sense_category: str) -> List[ChatSession]:
        return self.repo.get_sessions_by_type_category(sense_type, sense_category)

    def get_sessions_by_type_category_customer_id(self, sense_type: str, sense_category: str, customer_id: str) -> List[
        ChatSession]:
        return self.repo.get_sessions_by_type_category_customer_id(sense_type, sense_category, customer_id)

    def get_chat_messages_by_session(self, session_id: int) -> List[ChatMessage]:
        return self.repo.get_chat_messages_by_session(session_id)

    def get_chat_session_by_id(self, session_id: int) -> ChatSession:
        return self.repo.get_chat_session_by_id(session_id)

    def update_chat_session_status(self, session_id: int, status: str) -> ChatSession:
        return self.repo.update_chat_session_status(session_id=session_id, status=status)

    def delete_chat_session(self, session_id: int):
        self.repo.delete_chat_session(session_id=session_id)

    def update_chat_message_response(self, chat_message_id: int, query_response: str) -> ChatMessage:
        return self.repo.update_chat_message_response(chat_message_id, query_response)

    def create_chat_session_history(self, ask_request: AskRequest):
        session = self.create_chat_session(ask_request.customerId, ask_request.sense_type, ask_request.sense_category,
                                           ask_request.chat_session_id)
        message = self.create_chat_message(session.session_id, ask_request.sender_type, ask_request.query,
                                           ask_request.sender_id)
        return {'session': session, 'message': message}

    def update_chat_response(self, chat_message_id: int, query_response: str) -> ChatMessage:
        compressed_response = mvx_helper.compress_string(query_response)
        return self.repo.update_chat_message_response(chat_message_id, compressed_response)
