# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.contrib.auth.models import Group

from django.conf import settings

from django.contrib.contenttypes.models import ContentType

from django.apps import apps

from guardian.shortcuts import assign_perm, get_user_perms, get_users_with_perms, remove_perm, get_perms_for_model

from django.db.models.signals import pre_save, post_save, pre_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Define signals here

### UserProfile Signals
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def set_user_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'UserProfile'))
    for perm in perms:
        assign_perm(perm.codename, instance, instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

### Organization Signals
@receiver(pre_delete, sender='app_mgr.Organization')
def delete_org_groups(sender, instance=None, **kwargs):
    if instance.member_group != None:
        instance.member_group.delete()
    if instance.admin_group != None:
        instance.admin_group.delete()

@receiver(pre_save, sender='app_mgr.Organization')
def create_org_groups(sender, instance=None, created=False, **kwargs):
    if instance.member_group == None:
        g_name = '%s members' % (instance.name)
        instance.member_group = Group.objects.create(name=g_name)
    if instance.admin_group == None:
        g_name = '%s admins' % (instance.name)
        instance.admin_group = Group.objects.create(name=g_name)

@receiver(post_save, sender='app_mgr.Organization')
def set_org_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Organization'))
    
    if not created:
        old_members = get_users_with_perms(instance)
        for member in old_members:
            instance.member_group.user_set.remove(member)
            instance.admin_group.user_set.remove(member)
            for perm in perms:
                remove_perm(perm.codename, member, instance)
    
    new_members = instance.members.all()

    for member in (m for m in new_members if m.is_admin):
        instance.admin_group.user_set.add(member)
        instance.member_group.user_set.add(member)
        for perm in perms:
            assign_perm(perm.codename, member.user, instance)

    for member in (m for m in new_members if not m.is_admin):
        instance.member_group.user_set.add(member)
        assign_perm('view_organization', member.user, instance)

### Membership Signals
@receiver(post_save, sender='app_mgr.Membership')
def set_member_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Organization'))

    was_admin  = len(get_user_perms(instance.user, instance.org)) > 1

    if instance.is_admin and not was_admin:
        instance.org.admin_group.user_set.add(instance.user)
        for perm in perms:
            assign_perm(perm.codename, instance.user, instance.org)

    if not instance.is_admin and was_admin:
        instance.org.admin_group.user_set.remove(instance.user)
        for perm in perms:
            remove_perm(perm.codename, instance.user, instance.org)

    instance.org.member_group.user_set.add(instance.user)
    assign_perm('view_organization', instance.user, instance.org)

@receiver(pre_delete, sender='app_mgr.Membership')
def rm_org_perms(sender, instance=None, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Organization'))

    instance.org.admin_group.user_set.remove(instance.user)
    instance.org.member_group.user_set.remove(instance.user)
    for perm in perms:
        remove_perm(perm.codename, instance.user, instance.org)

### Application Signals
@receiver(post_save, sender='app_mgr.Application')
def set_app_perms(sender, instance=None, created=False, **kwargs):
    perms = get_perms_for_model(apps.get_model('app_mgr', 'Application'))

    if not created:
        old_members = get_users_with_perms(instance)
        for member in old_members:
            for perm in perms:
                remove_perm(perm.codename, member, instance)

    if instance.content_type.name == u'user profile':
        for perm in perms:
            assign_perm(perm.codename, instance.content_object, instance)
    
    if instance.content_type.name == u'organization':
        for perm in perms:
            assign_perm(perm.codename, instance.content_object.member_group, instance)
