from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
import logging
import os

# Serve Single Page Application
index = never_cache(TemplateView.as_view(template_name='index.html'))
