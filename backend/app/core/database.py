from backend.app.config.constants import MYSQL_HOST, MYSQL_PORT, MYSQL_USERNAME, MYSQL_PASSWORD

DB_CONFIG = {
    "host": MYSQL_HOST,  # e.g., "localhost"
    "port": MYSQL_PORT,  # Default MariaDB port
    "user": MYSQL_USERNAME,  # e.g., "root"
    "password": MYSQL_PASSWORD,  # Your database password
    "database": "real_state",  # Database name
}
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/real_state"

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create session local instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create tables if they do not exist
def create_tables():
    from src.chat_history.model.models import Base
    Base.metadata.create_all(bind=engine)
