from enum import Enum
from pydantic import BaseModel


class SenseType(str, Enum):
    data_sense = "data_sense"
    support_sense = "support_sense"


class AskRequest(BaseModel):
    sense_type: SenseType
    sense_category: str
    customerId: str
    sender_type: str
    sender_id: str
    chat_session_id: int
    db_name: str=None
    query: str
