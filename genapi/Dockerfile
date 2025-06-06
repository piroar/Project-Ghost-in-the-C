FROM ghcr.io/astral-sh/uv:debian

RUN mkdir -p /app

WORKDIR /app

COPY .env main.py pyproject.toml uv.lock /app/

RUN uv run main.py --init

CMD ["uv", "run", "main.py"]