from rest_framework import serializers

from custom_user.models import EmailUser

from AppMgr.models import UserProfile, Organization, Membership, Application, AppVersion

class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    org = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())
    class Meta:
        model = Membership
        fields = ('org', 'user', 'join_date')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailUser
        fields = ('id', 'email', 'date_joined',
                  'is_staff', 'is_active', )

class UserProfileSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(source='membership_set', many=True)
    user_details = UserSerializer(source='user', many=False)
    class Meta:
        model = UserProfile
        fields = ('id', 'user_details', 'memberships')

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
