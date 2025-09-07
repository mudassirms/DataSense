from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

from app.config.constants import OPENAI_MODEL
from app.agents.SchemaRetrieverAgent import SchemaRetrieverAgent
import json

class SQLQueryRetrieval:
    def __init__(self):
        llm = ChatOpenAI(model_name=OPENAI_MODEL)
        self.__schemaRetrivalAgent = SchemaRetrieverAgent()
        self.memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            k=10,
            return_messages=True,
            input_key="question"
        )

        # Custom Prompt
        self.__prompt_template = PromptTemplate(
            input_variables=["chat_history", "schema", "question"],
            template="""
            You are an AI MySQL assistant and Highcharts chart advisor.

            Given:
            - A database table schema
            - A natural language question

            Your task is to:
            1. Generate a valid SQL `SELECT` query (no `INSERT`, `UPDATE`, or `DELETE`)
            2. Recommend one or more suitable executable Highcharts visualizations Functions code like mentioned below in "chart_functions" where I will pass the generated SQL query result
            3. Do not include Markdown code block formatting (sql ...)
            4. provide at least 4 charts functions if possible and all method should name as def generate_chart.
            5. dont repeat same chart like count by priority of same chart type.
            6. Return the output in the following JSON format: 
            7. use  ignore case for data comparison
            {{
                "sql_query": "<your SQL query here>",
                "chart_functions": [
                    {{
                        "function_code": "def generate_chart(data):\\n    status_counts = {{}}\\n    category_counts = {{}}\\n    for item in data:\\n        status = item.get('status', 'Unknown')\\n        category = item.get('category', 'Uncategorized')\\n        status_counts[status] = status_counts.get(status, 0) + 1\\n        category_counts[category] = category_counts.get(category, 0) + 1\\n\\n    return [\\n        {{\\n            'title': 'Ticket Status Overview',\\n            'chart': {{ 'type': 'pie' }},\\n            'series': [\\n                {{\\n                    'name': 'Tickets',\\n                    'data': [{{'name': k, 'y': v}} for k, v in status_counts.items()]\\n                }}\\n            ]\\n        }},\\n        {{\\n            'title': 'Ticket Categories Overview',\\n            'chart': {{ 'type': 'pie' }},\\n            'series': [\\n                {{\\n                    'name': 'Tickets',\\n                    'data': [{{'name': k, 'y': v}} for k, v in category_counts.items()]\\n                }}\\n            ]\\n        }}\\n    ]"
                    }}
                ]
            }}

            Rules:
            - Each function must be a valid, executable Python function.
            - The `generate_chart` function should analyze the `data` and return a dictionary with Highcharts configuration (title, type, categories, series, etc.). with random colors to categories
            - Use common Highcharts types: 'pie', 'bar', 'column', 'line'.
            - Also add highcharts if ask in user query.
            - Ensure the returned chart config works with Highcharts JS library.
            - Handle edge cases like missing fields gracefully.

            Schema:
            {schema}

            Question:
            {question}
            """

        )

        # Chain to use the custom prompt
        self.__llm_chain = LLMChain(
            llm=llm,
            prompt=self.__prompt_template,
            memory=self.memory,
        )

    def generate_llm_response(self,collection, question: str) -> str:
        schema = self.__schemaRetrivalAgent.get_schema(collection, question)
        llm_response = self.__llm_chain.run(schema=schema, question=question)
        print(f'llm_response {llm_response}')
        llm_response.strip()
        response_obj = json.loads(llm_response)
        return response_obj
