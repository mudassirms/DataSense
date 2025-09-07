import random

import app.schemas.database as db
from app.services.chat_history_service import ChatHistoryService


def main():
    # Set up the database (create tables)
    chat_history_service = ChatHistoryService()
    db.create_tables()
    chat_session_id = random.randint(1, 1000)
    new_session = chat_history_service.create_chat_session(customer_id="musa123", sense_type="data_sense",
                                                           sense_category="real_state", chat_session_id=chat_session_id)
    new_session.session_id = 6
    print(f"Created new session: {new_session.chat_session_id}")

    # Create a new message
    new_message = chat_history_service.create_chat_message(session_id=new_session.session_id, sender_type="customer",
                                                           message_text="Hello, I need help!")
    print(f"Created new message: {new_message.message_id}")

    # Retrieve all messages for the session
    messages = chat_history_service.get_chat_messages_by_session(session_id=new_session.session_id)
    print("Messages in the session:")
    for msg in messages:
        print(f"Message: {msg.message_text}, Sender: {msg.sender_type}")

    chat_session = chat_history_service.get_sessions_by_type(sense_type="data_sense")
    for session in chat_session:
        print(
            f"session_id: {session.session_id}, sense_type: {session.sense_type}, sense_category: {session.sense_category}")


if __name__ == "__main__":
    main()
