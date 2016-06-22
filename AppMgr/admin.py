from django.contrib import admin

from django.contrib.contenttypes.admin import GenericTabularInline

from django.forms import ModelChoiceField

from custom_user.models import EmailUser 
from custom_user.admin import EmailUserAdmin as BaseUserAdmin

from AppMgr.models import UserProfile, Organization, Membership, Application, AppVersion

# Register your models here.

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    readonly_fields = ['id']
    fields = ['id']

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )

class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['id', 'name']

class MembershipAdmin(admin.ModelAdmin):
    search_fields = ['join_date']
    list_display = ['user', 'org', 'join_date']

class ApplicationInline(GenericTabularInline):
    model = Application
    ct_field = 'content_type'
    ct_fk_field = 'object_id'

class ApplicationAdmin(admin.ModelAdmin):
    inlines = [ApplicationInline]
    search_fields = ['name']

class AppVersionAdmin(admin.ModelAdmin):
    model = AppVersion
    search_fields = ['name', 'app']
    list_display = ['id', 'name', 'app', 'domain', 'aliases',]

admin.site.unregister(EmailUser)
admin.site.register(EmailUser, UserAdmin)

admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Membership, MembershipAdmin)

admin.site.register(Application, ApplicationAdmin)
admin.site.register(AppVersion, AppVersionAdmin)
