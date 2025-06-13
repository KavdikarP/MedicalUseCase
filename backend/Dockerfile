FROM tiangolo/uvicorn-gunicorn:python3.10
RUN mkdir app
RUN mkdir /app/tmp
WORKDIR /app

# Install poppler-utils, tesseract-ocr and perform upgrades
RUN apt-get update && \ 
    apt-get install -y poppler-utils tesseract-ocr libtesseract-dev && \
    apt upgrade -y

COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .