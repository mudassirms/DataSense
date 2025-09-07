from app.config.constants import *
from app.llm.embedding_provider import get_embedings
from pymilvus import connections, Collection, CollectionSchema, FieldSchema, DataType, list_collections, utility
from langchain_milvus import Milvus
from langchain.schema import Document
import app.config.vector_schema_defination as sd


class MVXMilvusClient():
    _instance = None
    milvus_host = MILVUS_HOST  # Ensure the host is set to 'milvus' (Docker container name)
    milvus_port = MILVUS_PORT  # Default port for Milvus
    _data_already_initialized = MILVUS_ALREADY_INITIALIZED
    connection_args = {
        "host": MILVUS_HOST,
        "port": MILVUS_PORT,
        "uri": f"http://{MILVUS_HOST}:{MILVUS_PORT}"
    }

    def __init__(self):
        self.document_schema = None
        self.table_schema = None
        connections.connect(
            alias="default",  # Alias for this connection
            host=MILVUS_HOST,
            port=MILVUS_PORT
        )
        self.host = MILVUS_HOST
        self.port = self.milvus_port

        # Remove redundant connection logic since the parent class already manages it
        print(f"Connected to Milvus at {self.host}:{self.port}")
        self.get_document_schema()
        self.get_table_schema()
        # Initialization check and collection deletion logic
        if not MVXMilvusClient._data_already_initialized:
            collections = list_collections()
            for collection_name in collections:
                utility.drop_collection(collection_name)
                print(f"Collection {collection_name} deleted.")

            MVXMilvusClient._data_already_initialized = True
        self.__tableSchemaInitialized = False

    def get_document_schema(self):
        document_fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1536),
            FieldSchema(name="metadata", dtype=DataType.VARCHAR, max_length=10000, default_value="{}"),
            FieldSchema(name="trapped", dtype=DataType.BOOL, default_value=False, nullable=True)
        ]
        self.document_schema = CollectionSchema(document_fields, description="documents schema",
                                                enable_dynamic_field=True)

    def get_table_schema(self):
        table_fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1536),
            FieldSchema(name="schema_text", dtype=DataType.VARCHAR, max_length=5000)
        ]
        self.table_schema = CollectionSchema(table_fields, description="Table structure collection")

    def create_documents_collection(self, collection_name):
        if not self._data_already_initialized:
            collection = Collection(name=collection_name, schema=self.document_schema)
            index_params = {
                "index_type": "IVF_FLAT",
                "metric_type": "L2",
                "params": {"nlist": 1024},
            }
            collection.create_index(field_name="embedding", index_params=index_params)
            print("Index created on the 'embedding' field.")

    def check_collection_exist_and_non_empty(self, collection_name):
        collection_exists = utility.has_collection(collection_name)
        if not collection_exists:
            return False
        collection = Collection(collection_name)
        collection.flush()
        collection.load()
        count = collection.num_entities
        if count == 0:
            return False
        return True

    def store(self, documents_with_collection: []):
        for collection in documents_with_collection:
            collection_name = collection['collection_name']
            if (self.check_collection_exist_and_non_empty(collection_name)):
                print(f'Collection Exist and Non Empty: {collection_name}')
            else:
                documents = collection['documents']
                embeddings = get_embedings()
                self.create_documents_collection(collection_name)
                Milvus(
                    connection_args=self.connection_args,
                    embedding_function=embeddings
                ).from_documents(
                    documents,
                    embeddings,
                    collection_name=collection_name,
                    text_field="page_content",
                    vector_field="embedding",
                    drop_old=True,
                    connection_args=self.connection_args,
                )

    def get_table_schema_document(self, dbName, tables):
        # Convert table structure into plain text format
        schema_texts = [
            f"Database: {dbName}\n"
            f"Table: {t['schema table name']}\n"
            "Columns:\n" + "\n".join(t['schema table columns'])
            for t in tables
        ]

        documents = [
            Document(
                page_content=text,
                metadata={
                    "table": t['schema table name'],
                    "database": dbName,
                    "type": "schema_description"
                }
            )
            for text, t in zip(schema_texts, tables)
        ]
        return documents

    def init_data_collection(self):
        index_params = {
            "index_type": "IVF_FLAT",
            "metric_type": "L2",
            "params": {"nlist": 128},
        }
        for d in sd.schema_definitions:
            collection_name = d["schema database"]
            tables = d.get("tables")
            if self.__tableSchemaInitialized:
                print("Table Schema already inittialized...")
                return
            if self.check_collection_exist_and_non_empty(collection_name):
                print("Table Schema already exist...")
                return
            utility.drop_collection(collection_name)

            data_collection = Collection(
                name=collection_name,
                schema=self.table_schema
            )
            data_collection.create_index(
                field_name="embedding",
                index_params=index_params
            )
            print("Index created on the 'embedding' field.")

            documents = self.get_table_schema_document(collection_name, tables)
            embeddings = get_embedings()
            milvus_vectorstore = Milvus(
                connection_args=self.connection_args,
                embedding_function=embeddings
            ).from_documents(
                documents,
                embeddings,
                collection_name=collection_name,
                text_field="page_content",
                vector_field="embedding",
                drop_old=True,
                connection_args=self.connection_args,
            )
            milvus_vectorstore.add_documents(documents)
            print(f"Collection created: {data_collection.name}")

    def get_vector_db_by_collection_name(self, collection_name):
        """Returns a vector database for a given collection name."""
        embeddings = get_embedings()
        return Milvus(
            collection_name=collection_name,
            embedding_function=embeddings,
            text_field="page_content",
            vector_field="embedding",
            connection_args=self.connection_args,
        )

    def list_support_sense_collection(self):
        collections = list_collections()
        return collections
