FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu --no-cache-dir
RUN pip3 install --no-cache-dir -r requirements.txt
COPY . .

RUN cd VectorDatabases && \
    python3 datagovin_vectordb_generate.py && \
    python3 icar_vectordb_generate.py

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
