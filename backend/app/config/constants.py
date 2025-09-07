import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore")
# Load environment variables from .env file
load_dotenv()

# General Configurations
PROJECT_NAME = "Document Vectorization Project"
PROJECT_VERSION = "1.0.0"

# Milvus Database Configurations
MILVUS_HOST = os.getenv("MILVUS_HOST", "milvus")
MILVUS_PORT = os.getenv("MILVUS_PORT", "19530")
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
# Resolve the full path to the 'docs' folder safely across platforms
DOCUMENT_BASE_FOLDER = os.path.abspath(
    os.path.join(PROJECT_ROOT, "../..", os.getenv("DOCUMENT_BASE_FOLDER", "docs"))
)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")      # Set your OpenAI API key here
EMBEDDING_DIMENSION = 1536  # Example: OpenAI embeddings have a dimension of 1536
BATCH_SIZE = 16  # Batch size for embedding processing
VECTOR_DB_TIMEOUT = 10  # Timeout in seconds for vector DB operations
VECTOR_DB_RETRIES = 3  # Number of retries in case of failures
VECTOR_DB_CLIENT='MILVUS' # MILVUS OR FAISS
USE_LLM="OPENAI" # OLLAMA, OPENAI
OLLAMA_MODEL='gemma3:1b' #gemma3:1b deepseek-r1:1.5b tinyllama
OPENAI_MODEL='gpt-4o-mini'
MILVUS_ALREADY_INITIALIZED=False
