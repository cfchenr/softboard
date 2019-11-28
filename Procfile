release: python manage.py migrate
web: gunicorn -b :5454 megua.wsgi --log-file=-