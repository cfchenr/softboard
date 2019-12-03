FROM python:3.6 AS builder
WORKDIR /app/
COPY requirements.txt /app/
RUN pip3 install --upgrade pip -r requirements.txt
COPY . /app/
EXPOSE 8000
CMD python3 manage.py makemigrations
CMD python3 manage.py migrate
CMD python3 manage.py runserver 0.0.0.0:8000

FROM node:13.2.0
WORKDIR /app/
COPY --from=builder . /app/
COPY package.json yarn.lock /app/
RUN npm install
RUN yarn
COPY . /app/
EXPOSE 3000
RUN yarn build