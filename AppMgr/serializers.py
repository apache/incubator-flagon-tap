from rest_framework import serializers

from django.contrib.auth import get_user_model

from AppMgr.models import UserProfile, Organization, Membership, Application, AppVersion

class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    org = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())
    class Meta:
        model = Membership
        fields = ('org', 'user', 'join_date')

class UserProfileSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(source='membership_set', many=True)
    class Meta:
        model = UserProfile
        fields = ('id', 'email', 'date_joined',
                  'is_staff', 'is_active', 'public_contact',
                   'memberships')

class OrganizationSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(source='membership_set', many=True)
    class Meta:
        model = Organization
        fields = ('id', 'name', 'memberships')

class OwnerRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, UserProfile):
            serializer = UserProfileSerializer(value)
        elif isinstance(value, Organization):
            serializer = OrganizationSerializer(value)
        else:
            raise Exception('Unexpected type for owner')
      
        return serializer.data

class AppVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppVersion
        fields = ('id', 'name', 'domain', 'aliases')

class ApplicationSerializer(serializers.ModelSerializer):
    versions = AppVersionSerializer(source='appversion_set', many=True)
    class Meta:
        model = Application
        fields = ('id', 'name', 'isPublic', 'versions')
