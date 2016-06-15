"""
Django settings for tap project.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

import os

from base import *

INSTALLED_APPS += (
    'django_extensions',
)

DEBUG = True
TEMPLATE_DEBUG = True

