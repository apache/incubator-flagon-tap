from django.contrib import admin

from django.contrib.contenttypes.admin import GenericTabularInline

from custom_user.models import EmailUser 
from custom_user.admin import EmailUserAdmin as BaseUserAdmin

from AppMgr.models import UserProfile, Organization, Application, AppVersion

# Register your models here.

class UserProfileInline(admin.StackedInline):
    model = UserProfile

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )

class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['name']

class ApplicationInline(GenericTabularInline):
    model = Application
    ct_field = 'content_type'
    ct_fk_field = 'object_id'

class ApplicationAdmin(admin.ModelAdmin):
    inlines = [ApplicationInline]
    search_fields = ['name']
    list_display = ['name']

admin.site.unregister(EmailUser)
admin.site.register(EmailUser, UserAdmin)

admin.site.register(Organization, OrganizationAdmin)

admin.site.register(Application, ApplicationAdmin)
