FROM python:3.13.4-slim-bullseye

RUN apt-get update && \
    apt-get install -y build-essential && \
    rm -rf /var/lib/apt/lists/* && \
    which gcc # Verify that gcc is installed and its path

WORKDIR /app

COPY api/check/recheck.py ./
COPY api/check/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5172

CMD ["python","recheck.py"]