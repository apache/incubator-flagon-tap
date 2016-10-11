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

from rest_framework.permissions import DjangoObjectPermissions
from django.http import Http404
from guardian.shortcuts import get_perms, get_perms_for_model, get_users_with_perms

SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')

class ViewControlObjectPermissions(DjangoObjectPermissions):
    """ same as base object level permissions, plus read permission """
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

class ApplicationObjectPermissions(DjangoObjectPermissions):
    """ same as base object level permissions, plus read permission """
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

    def has_object_permission(self, request, view, obj):
        if hasattr(view, 'get_queryset'):
            queryset = view.get_queryset()
        else:
            queryset = getattr(view, 'queryset', None)

        assert queryset is not None, (
            'Cannot apply DjangoObjectPermissions on a view that '
            'does not set `.queryset` or have a `.get_queryset()` method.'
        )

        model_cls = queryset.model
        user = request.user

        perms = self.get_required_object_permissions(request.method, model_cls)

        if obj.isPublic and request.method == 'GET':
            perms = []

        #print "-----------"
        #print request.method, perms
        #print obj.id, obj
        #if request.user.is_authenticated():
        #    print user.id, user.email
        #else:
        #    print "ANON"
        #print user.has_perms(perms, obj)
        #print get_perms(request.user, obj)
        #print get_perms_for_model(model_cls)
        #print get_users_with_perms(obj)
        #print "~~~~~~~~~~~"

        if not user.has_perms(perms, obj):
            # If the user does not have permissions we need to determine if
            # they have read permissions to see 403, or not, and simply see
            # a 404 response.

            if request.method in SAFE_METHODS:
                # Read permissions already checked and failed, no need
                # to make another lookup.
                raise Http404

            read_perms = self.get_required_object_permissions('GET', model_cls)
            if not user.has_perms(read_perms, obj):
                raise Http404

            # Has read permissions.
            #print "read permitted"
            return False

        #print "is permitted"
        return True
