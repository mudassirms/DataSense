from app.agents.ChartGeneratorAgent import ChartGeneratorAgent
# from app.agents.DataSummarizeAgent import DataSummarizeAgent
from app.agents.SQLQueryRetrieval import SQLQueryRetrieval
from app.repositories.sql_repository import SqlRepository
from fastapi.encoders import jsonable_encoder

sqlQueryRetriever = SQLQueryRetrieval()
chartGeneratorAgent = ChartGeneratorAgent()


# dataSummarizeAgent = DataSummarizeAgent()


def question_to_sql(collection, user_question):
    return sqlQueryRetriever.generate_llm_response(collection, user_question)


def get_sql_result_from_llm_query(dbName, llm_response):
    sql_repo = SqlRepository(dbName)
    sql_query = llm_response["sql_query"]
    print("Generated SQL:", sql_query)
    query_result = sql_repo.execute_query(sql_query)
    sql_result_rows = [dict(row._mapping) for row in query_result]
    result = jsonable_encoder(sql_result_rows)
    print("Query Result:", result)
    return result


def get_charts_from_llm_query(llm_response, query_result):
    executables = llm_response["chart_functions"]
    charts = chartGeneratorAgent.generate_charts(executables, query_result)
    return charts


def question_to_sql_data(dbName, user_question):
    llm_response = question_to_sql(dbName, user_question)
    result = {}
    if llm_response:
        query_result = get_sql_result_from_llm_query(dbName, llm_response)
        query_result = jsonable_encoder(query_result)

        charts = get_charts_from_llm_query(llm_response, query_result)
        result = {
            'query': user_question,
            'table': query_result,
            'charts': charts,
        }
    return result

# def summarize_data(data):
#     summarize = dataSummarizeAgent.summaries_data(data)
#     return summarize


# def generate_chart(data):
#     charts = chartGeneratorAgent.generate_chart(data)
#     return charts
