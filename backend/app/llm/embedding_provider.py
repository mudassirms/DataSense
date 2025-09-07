from langchain_community.embeddings import OpenAIEmbeddings


def get_embedings():
    # return OllamaEmbeddings(model="nomic-embed-text") if USE_LLM == 'OLLAMA' else OpenAIEmbeddings(model="text-embedding-3-small")
    return OpenAIEmbeddings(model="text-embedding-3-small")
