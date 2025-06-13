FROM python:3.13.4-slim-bullseye

WORKDIR /app

COPY api/cgen/reserver.py ./
COPY api/cgen/.env ./
COPY api/cgen/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD [ "uvicorn", "reserver:app", "--host", "0.0.0.0", "--port", "5000"]
