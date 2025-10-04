ARG SOURCEDIR="src"
ARG PYTHONVERSION="3.13-slim-bookworm"

FROM python:${PYTHONVERSION} AS builder
ARG SOURCEDIR

ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN adduser --disabled-password --home /home/server server
USER server

WORKDIR /home/server

COPY requirements.txt requirements_dev.txt ./

RUN python -m pip install pip~=23.0 --upgrade --no-cache-dir \
    --disable-pip-version-check --no-compile && \
    python -m pip install -r requirements.txt \
    python -m pip install -r requirements_dev.txt \
    --no-cache-dir --disable-pip-version-check --no-compile &&

FROM python:${PYTHONVERSION} AS runtime
ARG SOURCEDIR

ENV PATH=/home/server/.local/bin:$PATH

RUN apt-get update && \
    apt-get upgrade --assume-yes && \
    apt-get install --assume-yes curl && \
    rm -rf /var/lib/apt/lists/*

RUN adduser --disabled-password --home /home/server server
USER server

WORKDIR /home/server

COPY --from=builder /home/server/.local /home/server/.local

COPY . ./${SOURCEDIR}

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD curl --include --request GET http://localhost:8000/health || exit 1