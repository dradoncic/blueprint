ARG SOURCEDIR="src"
ARG PYTHONVERSION="3.13-slim-bookworm"

FROM python:${PYTHONVERSION} AS builder
ARG SOURCEDIR

ENV PYTHONBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH=/home/server/.local/bin:$PATH


RUN adduser --disabled-password --home /home/server server
USER server
WORKDIR /home/server

COPY requirements.txt requirements_dev.txt ./

RUN python -m pip install --upgrade pip~=23.0 --no-cache-dir \
    --disable-pip-version-check && \
    python -m pip install -r requirements.txt -r requirements_dev.txt --no-cache-dir \
    --disable-pip-version-check


FROM python:${PYTHONVERSION} AS runtime
ARG SOURCEDIR

ENV PATH=/home/server/.local/bin:$PATH

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

RUN adduser --disabled-password --home /home/server server
USER server
WORKDIR /home/server

COPY --from=builder /home/server/.local /home/server/.local

COPY ${SOURCEDIR} ./src

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD curl --include --request GET http://localhost:8000/health || exit 1