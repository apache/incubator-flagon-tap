from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import JSONField

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from django.contrib.auth import get_user_model

from django.apps import apps

from custom_user.models import AbstractEmailUser

from guardian.mixins import GuardianUserMixin
from guardian.shortcuts import assign_perm, get_user_perms, get_users_with_perms, remove_perm, get_perms_for_model

from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Define signals here
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def set_user_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'UserProfile'))
    for perm in perms:
        assign_perm(perm.codename, instance, instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

@receiver(post_save, sender='app_mgr.Organization')
def set_owner_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Organization'))
    
    if not created:
        old_members = get_users_with_perms(instance)
        for member in old_members:
            for perm in perms:
                remove_perm(perm.codename, member, instance)
    
    new_members = instance.members.all()
    for member in (m for m in members if m.is_admin):
        for perm in perms:
            assign_perm(perm.codename, member.user, instance)
    for member in (m for m in members if not m.is_admin):
        assign_perm('view_organization', member.user, instance)

@receiver(post_save, sender='app_mgr.Membership')
def set_org_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Organization'))

    was_admin  = len(get_user_perms(instance.user, instance.org)) > 1

    if instance.is_admin and not was_admin:
        for perm in perms:
            assign_perm(perm.codename, instance.user, instance.org)

    if not instance.is_admin and was_admin:
        for perm in perms:
            remove_perm(perm.codename, instance.user, instance.org)

    assign_perm('view_organization', instance.user, instance.org)

# Create your models here.
@receiver(pre_delete, sender='app_mgr.Membership')
def rm_org_perms(sender, instance=None, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Organization'))

    for perm in perms:
        remove_perm(perm.codename, instance.user, instance.org)

# Create your models here.
class UserProfile(AbstractEmailUser, GuardianUserMixin):

    public_contact = models.BooleanField(default=False)

    class Meta:
        permissions = (
            ("view_userprofile", "view profile information"),
        )

    def __unicode__(self):
        return self.email

class Organization(models.Model):
    name = models.CharField(max_length=255)

    members = models.ManyToManyField(UserProfile, through='Membership')

    class Meta:
        permissions = (
            ("view_organization", "view organization information"),
        )

    def __unicode__(self):
        return self.name

class Membership(models.Model):
    user = models.ForeignKey(UserProfile,  null=True, blank=False)
    org  = models.ForeignKey(Organization, null=True, blank=False)
    join_date = models.DateTimeField()
    is_admin = models.BooleanField(default=False)
    
class Application(models.Model):
    name = models.CharField(max_length=255)

    isPublic = models.BooleanField(default=True)

    #Application owner can be either a UserProfile or an Organization    
    limit = models.Q(app_label='app_mgr', model='userprofile') | \
            models.Q(app_label='app_mgr', model='organization') 
    #limit = {'app_label__in': ('app_mgr',), 
    #         'model__in': ('UserProfile', 'Organization', ), }
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
            ("view_application", "read access to the application"),
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
