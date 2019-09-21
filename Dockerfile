FROM python:3.7.4
ENV PYTHONUNBUFFERED 1
RUN mkdir /usr/src
WORKDIR /usr/src
COPY requirements.txt /usr/src/
RUN pip install -r requirements.txt
COPY . /usr/src/