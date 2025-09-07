# import json
#
# from transformers import pipeline, BartTokenizer
#
# class DataSummarizeAgent:
#     def __init__(self):
#         self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
#         self.tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
#         self.max_tokens = 1000  # keep below model max input length (1024)
#
#     def chunk_text(self, text):
#         words = text.split()
#         chunks = []
#         current_chunk = []
#         current_length = 0
#
#         for word in words:
#             token_length = len(self.tokenizer.tokenize(word))
#             if current_length + token_length > self.max_tokens:
#                 chunks.append(" ".join(current_chunk))
#                 current_chunk = [word]
#                 current_length = token_length
#             else:
#                 current_chunk.append(word)
#                 current_length += token_length
#         if current_chunk:
#             chunks.append(" ".join(current_chunk))
#         return chunks
#
#     def summaries_data(self, data):
#         json_text = json.dumps(data)
#         chunks = self.chunk_text(json_text)
#         summaries = []
#         for chunk in chunks:
#             summary = self.summarizer(chunk, min_length=10, do_sample=False)
#             summaries.append(summary[0]['summary_text'])
#         return " ".join(summaries)
