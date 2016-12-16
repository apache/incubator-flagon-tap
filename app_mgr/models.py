# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at

#   http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import JSONField

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from custom_user.models import AbstractEmailUser

from guardian.mixins import GuardianUserMixin

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

    member_group = models.OneToOneField(Group, null=True, blank=True,
                                        related_name='members_of')
    admin_group = models.OneToOneField(Group, null=True, blank=True,
                                       related_name='admins_of')

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
