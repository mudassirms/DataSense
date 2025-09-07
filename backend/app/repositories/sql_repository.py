import app.schemas.database as database
from sqlalchemy import text


class SqlRepository:
    def __init__(self, dbName):
        self.dbName = dbName

    def execute_query(self, query):
        session = database.get_session_by_db_name(self.dbName)
        try:
            data = session.execute(text(query)).fetchall()
            return data
        finally:
            session.close()
