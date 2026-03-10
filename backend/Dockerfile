FROM python:3.11-slim

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app/app
COPY ./ml /app/ml
COPY ./.env /app/.env
COPY ./data /app/data

# Use shell form for CMD so environment variables like $PORT are expanded natively
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
