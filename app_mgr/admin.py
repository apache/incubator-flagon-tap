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
    list_display = ['user', 'org', 'join_date']

class ApplicationInline(GenericTabularInline):
    model = Application
    ct_field = 'content_type'
    ct_fk_field = 'object_id'

class ApplicationAdmin(GuardedModelAdmin):
    inlines = [ApplicationInline]
    search_fields = ['name']

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
