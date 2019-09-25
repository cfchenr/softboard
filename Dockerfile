FROM python:3.7.4
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src
COPY . /usr/src
RUN pip install -r requirements.txt