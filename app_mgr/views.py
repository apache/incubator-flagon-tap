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

from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.views import password_reset, password_reset_confirm
from django.contrib.sites.shortcuts import get_current_site
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings


from django.db import IntegrityError
from django.db.models import Q

from django.views.generic.base import RedirectView

from axes.decorators import watch_login

from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
#from rest_framework.authtoken import views as token_views

from guardian.shortcuts import assign_perm, get_objects_for_user

from app_mgr.permissions import ViewControlObjectPermissions
from app_mgr.permissions import ApplicationObjectPermissions
from app_mgr.models import UserProfile, Organization, Application, AppVersion
from app_mgr.serializers import UserProfileSerializer, OrganizationSerializer, ApplicationSerializer

import datetime
import requests

#
# RESTFUL VIEWS
#

# LIST RETRIEVE
class UserProfileListView(generics.ListCreateAPIView):
    """
    Returns a list of all user profiles.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        # only used for list
        return get_objects_for_user(self.request.user, "view_userprofile",
                                    UserProfile.objects.all())

class OrganizationListView(generics.ListCreateAPIView):
    """
    Returns a list of all organizations.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_queryset(self):
        # only used for list
        return get_objects_for_user(self.request.user, "view_organization",
                                    Organization.objects.all())

class ApplicationListView(generics.ListCreateAPIView):
    """
    Returns a list of all applications.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        # only used for list
        owned = get_objects_for_user(self.request.user, "view_application",
                                     Application.objects.all())
        public = Application.objects.filter(isPublic=True)

        viewable = list(set(list(owned) + list(public)))

        return viewable

# SINGLE RETRIEVE/UPDATE/DESTROY
class UserProfileInstanceView(generics.RetrieveUpdateDestroyAPIView):
    """
    Returns a single user.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (ViewControlObjectPermissions,)
    _ignore_model_permissions = True

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get(self, request, *args, **kwargs):
        if kwargs['pk'] == 'current':
            self.kwargs['pk'] = str(request.user.id)
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        if kwargs['pk'] == 'current':
            self.kwargs['pk'] = str(request.user.id)
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if kwargs['pk'] == 'current':
            self.kwargs['pk'] = str(request.user.id)
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if kwargs['pk'] == 'current':
            self.kwargs['pk'] = str(request.user.id)
        return self.destroy(request, *args, **kwargs)

class OrganizationInstanceView(generics.RetrieveUpdateDestroyAPIView):
    """
    Returns a single org.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (ViewControlObjectPermissions,)
    _ignore_model_permissions = True

    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class ApplicationInstanceView(generics.RetrieveUpdateDestroyAPIView):
    """
    Returns a single app.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (ApplicationObjectPermissions,)
    _ignore_model_permissions = True

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


# REDIRECTS
#class UserRedirectView(RedirectView):
#
#    permanent = False
#    query_string = True
#    #pattern_name = 'user-instance'
#
#    def get(self, request, *args, **kwargs):
#        print request
#        print request.user.id
#        print request.auth
#        kwargs['pk'] = request.user.id
#        self.url = '/app_mgr/user/%s' % (request.user.id)
#        return super(UserRedirectView, self).get(request, args, **kwargs)

#
# AUTHENTICATION VIEWS
#

# creates a new user
def register(request):
    # TODO : add logging back in.  Good practice!!
    # Like before, get the request's context.
    context = RequestContext(request)

    # A boolean value for telling the template whether the registration was successful.
    # Set to False initially. Code changes value to True when registration succeeds.
    registrationSuccessful = False
    userExists = False
    error = False

    # If it's a HTTP POST, we're interested in processing form data.
    if request.method == 'POST':

        # Now we hash the password with the set_password method.
        # Once hashed, we can update the user object.
        user = get_user_model()(email=request.POST['email'])
        user.set_password(request.POST['password'])
        user.last_login = '1970-01-01 00:00'

        if not user.email or not request.POST['password']:
            error = True
            return JsonResponse({'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error})
            #return render_to_response('registration/register.html', {'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error}, context)

        try:
            user.save()
        except IntegrityError:
            userExists = True
            return JsonResponse({'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error})
            #return render_to_response('registration/register.html', {'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error}, context)

        # Now sort out the UserProfile instance.
        # Since we need to set the user attribute ourselves, we set commit=False.
        # This delays saving the model until we're ready to avoid integrity problems.
        ###userprofile = UserProfile()
        ###userprofile.user = user

        # Now we save the UserProfile model instance.
        ###userprofile.save()

        # Set permissions for own profile
        assign_perm('view_userprofile', user, user)
        assign_perm('change_userprofile', user, user)
        assign_perm('delete_userprofile', user, user)
        #assign_perm('view_userprofile', user, userprofile)
        #assign_perm('change_userprofile', user, userprofile)
        #assign_perm('delete_userprofile', user, userprofile)

        # Update our variable to tell the template registration was successful.
        registrationSuccessful = True

        # add some logic to log events, log in users directly
        #print "successful registration of " + request.POST['email'] +" "+ datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print( "successful registration of {0} {1}".format(request.POST['email'], datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")) )
        request.POST['email_to'] = user.email
        request.POST['email_subject'] = 'Welcome to TAP'
        request.POST['email_message'] = 'Your registration was successful!\n\nIn case you forget your password, please go to the following page and reset your password:\n\nhttps://' + get_current_site(request).domain + '/app_mgr/reset/\n\nYour username, in case you\'ve forgotten, is the email address this message was sent to.\n\nThanks for using our site!\n\nThe ' + get_current_site(request).name + ' team'

        # Update this if TAP wants email on registration
        #exp_portal.email.send_email(request)

    return JsonResponse({'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error})
    #return render_to_response('abcd.html', context)
    #return render_to_response('registration/register.html', {'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error}, context)


def logout_user(request):
    """
    Log users out and re-direct them to the main page.
    """
    logout(request)
    return HttpResponseRedirect('/app_mgr/login/')

@watch_login
def login_user(request):
        # Like before, obtain the context for the user's request.
    context = RequestContext(request)

    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        # Gather the username (email) and password provided by the user.
        # This information is obtained from the login form.
        email = request.POST['email']
        password = request.POST['password']
        # print "Login attempt by " + username + " at " + datetime

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(email=email, password=password)

        # If we have a User object, the details are correct.
        # If None (Python's way of representing the absence of a value), no user
        # with matching credentials was found.
        if user:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # We'll send the user back to the homepage.
                login(request, user)
                userToken = get_token(email, password)
                print( "Successful Login: {0}, id: {1}, token: {2}".format(email, user.id, userToken) )
                return HttpResponse(userToken)
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your TAP account is disabled.")
        else:
            # Bad login details were provided. So we can't log the user in.
            print( "Invalid login details: {0}, {1}".format(email, password) ) ###TODO - PASSWORD EXPOSED
            return HttpResponse("Invalid login details supplied.")

    # The request is not a HTTP POST, so display the login form.
    # This scenario would most likely be a HTTP GET.
    else:
        # No context variables to pass to the template system, hence the
        # blank dictionary object...
        # experiment_title = title
        return render(request, 'registration/login.html')
        # return render(request, 'registration/login.html', {'experiment_title': experiment_title})

        # return login_view(request, authentication_form=MyAuthForm)

def get_token(email, password):
    credentials = {'username':email, 'password':password}
    tokenResponse = requests.post('http://localhost:8000/api-token-auth/', credentials)
    return tokenResponse.text

def reset_confirm(request, uidb64=None, token=None):
    return password_reset_confirm(request, template_name='registration/reset_password_confirm.html',
                                  uidb64=uidb64, token=token,
                                  post_reset_redirect=reverse('app_mgr:login'))


def reset(request):
    return password_reset(request, template_name='registration/reset_password_form.html',
                          email_template_name='registration/reset_password_email.html',
                          post_reset_redirect=reverse('app_mgr:reset_sent'),
                          from_email=settings.EMAIL_FROM_NOMINAL_ADDRESS)

def reset_sent(request):
    return render(request, 'registration/reset_password_done.html')

@login_required(login_url='/app_mgr/login/')
def view_profile(request):
    user = request.user
    return render(request, 'user_profile.html',
                  {'user': request.user,
                  }
                 )

# def get_app_results_fields(request, check):
#     user = request.user
#     return render(request, 'user_profile.html',
#                   {'user': request.user,
#                   }
#                  )

# def get_app_results(request, check):
#     user = request.user
#     return render(request, 'user_profile.html',
#                   {'user': request.user,
#                   }
#                  )
