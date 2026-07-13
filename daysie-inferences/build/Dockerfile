FROM python:3.10.17-bookworm

# Set workdir
WORKDIR /app

# Install system dependencies needed by TensorFlow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libhdf5-dev \
    libhdf5-serial-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY . .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# Default command
CMD ["uvicorn", "script1:app", "--host", "0.0.0.0", "--port", "8000"]

