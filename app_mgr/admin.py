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

from django.contrib import admin

from django.contrib.contenttypes.admin import GenericTabularInline

from django.forms import ModelChoiceField

from django.contrib.auth import get_user_model
from custom_user.admin import EmailUserAdmin as BaseUserAdmin

from guardian.admin import GuardedModelAdmin

from app_mgr.models import UserProfile, Organization, Membership, Application, AppVersion

# Register your models here.

class UserAdmin(BaseUserAdmin, GuardedModelAdmin):
    list_display = ['id', 'email', 'public_contact']
#    pass

class OrganizationAdmin(GuardedModelAdmin):
    search_fields = ['name']
    list_display = ['id', 'name']

class MembershipAdmin(admin.ModelAdmin):
    search_fields = ['join_date']
    list_display = ['user', 'org', 'is_admin', 'join_date']

class ApplicationInline(GenericTabularInline):
    model = Application
    ct_field = 'content_type'
    ct_fk_field = 'object_id'

class ApplicationAdmin(GuardedModelAdmin):
    inlines = [ApplicationInline]
    search_fields = ['name']
    list_display = ['id', 'name', 'isPublic']

class AppVersionAdmin(admin.ModelAdmin):
    model = AppVersion
    search_fields = ['name', 'app']
    list_display = ['id', 'name', 'app', 'domain', 'aliases',]

#admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), UserAdmin)

admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Membership, MembershipAdmin)

admin.site.register(Application, ApplicationAdmin)
admin.site.register(AppVersion, AppVersionAdmin)
