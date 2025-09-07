from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
import app.schemas.database as database
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.models.request_response_models import AskRequest
import app.services.data_sense_service as data_sense_service
from app.services.chat_history_service import ChatHistoryService
from app.vector_db.milvus_loader import MVXMilvusClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = MVXMilvusClient()
    client.init_data_collection()
    logger.info("Starting up... Creating tables")
    database.create_tables()
    yield
    logger.info("Shutting down...")

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/api/collections")
async def get_collections():
    result_list = [
        {"code": db_name, "name": db_name.replace("_", " ").title()}
        for db_name in database.DB_URL_MAP.keys()
    ]
    return JSONResponse(result_list, status_code=200)


@app.post("/api/data/ask")
async def create_item(ask_request: AskRequest):
    ask_request.sense_category = ask_request.db_name
    chat_service = ChatHistoryService(ask_request.db_name)
    chat_session_and_message = chat_service.create_chat_session_history(ask_request)
    result = data_sense_service.question_to_sql_data(ask_request.db_name, ask_request.query)
    chat_service.update_chat_response(chat_session_and_message.get('message').message_id, result)
    return JSONResponse(content=result, status_code=200)

@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200)
