from django.db import models
from django.conf import settings

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    # additional user parameters

    def __unicode__(self):
        return self.user.email

class Organization(models.Model):
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return self.name

class Application(models.Model):
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return self.name
