import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Declare base
Base = declarative_base()

# Default DB
DEFAULT_DATABASE_URL = os.getenv("DEFAULT_DATABASE_URL")

# Build additional DB map from env
def build_db_url_map():
    db_url_map = {}
    for key, value in os.environ.items():
        if key.startswith("DATABASE_URL_") and key != "DEFAULT_DATABASE_URL":
            db_code = key.replace("DATABASE_URL_", "").lower()
            db_url_map[db_code] = value
    return db_url_map

# Combine all DBs including default
DB_URL_MAP = build_db_url_map()
ALL_DB_URLS = {"default": DEFAULT_DATABASE_URL, **DB_URL_MAP}

# Engine and session map
ENGINE_MAP = {}
SESSION_LOCAL_MAP = {}

for db_name, db_url in ALL_DB_URLS.items():
    engine = create_engine(db_url)
    ENGINE_MAP[db_name] = engine
    SESSION_LOCAL_MAP[db_name.lower()] = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Create tables in all DBs
def create_tables():
    from app.schemas.entity_models import Base  # Or reuse the global Base if no circular import
    for db_name, engine in ENGINE_MAP.items():
        print(f"Creating tables in DB: {db_name}")
        Base.metadata.create_all(bind=engine)

# Get session by DB name
def get_session_by_db_name(db_name: str = 'default'):
    key = db_name.lower()
    session_factory = SESSION_LOCAL_MAP.get(key)
    if not session_factory:
        raise ValueError(f"No session factory found for DB: {db_name}")
    return session_factory()
