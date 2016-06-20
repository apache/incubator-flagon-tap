from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import JSONField

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    def __unicode__(self):
        return self.user.email

class Organization(models.Model):
    name = models.CharField(max_length=255)

    members = models.ManyToManyField(UserProfile)

    class Meta:
        permissions = (
            ("admin", "All organizational privileges"),
            ("change_apps", "Create/Modify/Delete Org's Applications"),
            ("change_members", "Add/Remove Users"),
        )

    def __unicode__(self):
        return self.name

class Application(models.Model):
    name = models.CharField(max_length=255)

    isPublic = models.BooleanField(default=True)

    #Application owner can be either a UserProfile or an Organization    
    limit = models.Q(app_label='AppMgr', model='UserProfile') | \
            models.Q(app_label='AppMgr', model='Organization') 
    content_type = models.ForeignKey(
            ContentType,
            verbose_name='application owner',
            limit_choices_to=limit,
            null=True,
            blank=True,
    )
    object_id = models.PositiveIntegerField(
            verbose_name='app owner id',
            null=True,
    )
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        permissions = (
            ("admin", "All application privileges"),
            ("edit", "add/modify application attributes"),
            ("view", "read access to the application"),
        )

    def __unicode__(self):
        return self.name

class AppVersion(models.Model):
    name = models.CharField(max_length=255)

    app = models.ForeignKey(Application, null=True, blank=False)

    aliases = JSONField()
    domain = models.URLField(max_length=255)

    def __unicode__(self):
        return self.name
