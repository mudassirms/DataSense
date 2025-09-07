FROM python:3.12.7-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
RUN echo "DEBUG: Files inside container" && find . -type f
ENV PYTHONPATH=/app
EXPOSE 8200
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8200"]
