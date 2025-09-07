import textwrap


class ChartGeneratorAgent:
    def __init__(self):
        pass

    def __generate_chart_schema(self, executable, db_data):
        chart_config = None
        try:
            namespace = {}
            executable = textwrap.dedent(executable)
            print("executable: ", executable)
            exec(executable, namespace)
            generate_chart = namespace['generate_chart']
            chart_config = generate_chart(db_data)
            print(chart_config)
        except Exception as e:
            print(e)

        return chart_config

    def generate_charts(self, executables, data):
        charts = []
        for executable in executables:
            chart = self.__generate_chart_schema(executable['function_code'], data)
            if isinstance(chart,list):
                chart = chart[0]
            if chart:
                title = chart['title']
                chart_obj = {
                    'title': title,
                    'chart': chart
                }
                charts.append(chart_obj)

        return charts

    # if __name__ == "__main__":
#     c = ChartGeneratorAgent()
#     chart_function_code = """
#         def generate_chart(data):
#             status_counts = {}
#             for item in data:
#                 status = item.get("status", "Unknown")
#                 status_counts[status] = status_counts.get(status, 0) + 1
#
#             return {
#                 "title": "Ticket Status Overview",
#                 "chart": {
#                     "type": "pie"
#                 },
#                 "series": [
#                     {
#                         "name": "Tickets",
#                         "data": [{"name": k, "y": v} for k, v in status_counts.items()]
#                     }
#                 ]
#             }
#         """
#     c.generate_chart_schema(chart_function_code)
