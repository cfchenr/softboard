release: python manage.py migrate
web: gunicorn -b 0.0.0.0:5454 megua.wsgi --log-file=-