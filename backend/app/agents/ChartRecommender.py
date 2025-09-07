from typing import Dict, Any
import numpy as np
from highcharts_core.chart import Chart


class ChartRecommender:
    @staticmethod
    def convert_to_highchart(data):
        chart = Chart.from_series(data, series_type='column')

        # Generate Highcharts-compatible JSON
        chart_json = chart.to_js_literal()
        return chart_json