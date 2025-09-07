from app.vector_db.milvus_loader import MVXMilvusClient
import app.schemas.database as database
import app.services.data_sense_service as data_sense_service
from app.models.request_response_models import AskRequest, SenseType

if __name__ == '__main__':
    client = MVXMilvusClient()
    client.init_data_collection()
    database.create_tables()
    ask_request = AskRequest(
        sense_type = SenseType.data_sense,
        sense_category="cybersecurity",
        customerId="12345",
        sender_type="customer",
        sender_id="12345",
        chat_session_id=12345,
        db_name="cybersecurity",
        query="top 10 incidents?")
    result = data_sense_service.question_to_sql_data(ask_request.db_name, ask_request.query)
