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

from rest_framework import serializers

from django.contrib.auth import get_user_model

from app_mgr.models import UserProfile, Organization, Membership, Application, AppVersion

class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    org = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())
    class Meta:
        model = Membership
        fields = ('org', 'user', 'is_admin', 'join_date')

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
