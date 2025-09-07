from app.config.constants import *
from langchain_openai import ChatOpenAI
from langchain_community.llms import Ollama


def get_llm():
    llm = Ollama(model=OLLAMA_MODEL) if USE_LLM == 'OLLAMA' else ChatOpenAI(model_name=OPENAI_MODEL)
    return llm
