import json
from datetime import date, datetime
import gzip
import base64


def convert_dates(obj):
    if isinstance(obj, (date, datetime)):
        return obj.strftime('%d-%m-%Y %H:%M')
    return obj


def convert_to_json(self, results):
    if results is None:
        return None
    return json.dumps(results, default=convert_dates)


def compress_string(response_data):
    json_str = json.dumps(response_data)
    return base64.b64encode(gzip.compress(json_str.encode("utf-8"))).decode("utf-8")


def decode_string(compressed_str):
    return gzip.decompress(base64.b64decode(compressed_str)).decode("utf-8")
