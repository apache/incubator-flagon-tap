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
from django.http import HttpResponseRedirect, HttpResponse
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

from tap.settings import DISTILL_URL as distillURL

#distillURL = "msbx.draper.com:8091"
#distillURL = "localhost:8090"  #moved url into tap/settings.py file

def app_results_byname(request, appName, searchType):
    completeurl = distillURL+'/search/'+appName+'/'+searchType
    completeurl = distillURL
    print ("APP RESULTS REQUESTED")
    print (completeurl)
    results = requests.get(completeurl)
    
    return HttpResponse(results)

def app_results(request, appId, searchType):
    completeurl = distillURL+'/search/'+appId+'/'+searchType
    completeurl = distillURL
    print ("APP RESULTS REQUESTED")
    print (completeurl)
    results = requests.get(completeurl)
    
    return HttpResponse(results)