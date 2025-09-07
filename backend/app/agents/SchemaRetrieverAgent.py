from app.vector_db.milvus_loader import MVXMilvusClient


class SchemaRetrieverAgent:
    def __init__(self):
        self.milvus_client = MVXMilvusClient()

    def get_schema(self,collection, question):
        vectorstore = self.milvus_client.get_vector_db_by_collection_name(collection)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        docs = retriever.get_relevant_documents(question)
        schema_text = "\n".join([doc.page_content for doc in docs])
        return schema_text