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

distillURL = "msbx.draper.com:8091"

def app_results_byname(request, appName, searchType):
    completeurl = distillURL+'/search/'+appName+'/'+searchType
    print (completeurl)
    results = requests.get(completeurl)
    
    return HttpResponse(results)

def app_results(request, appId, searchType):
    print ("hello")
    print (appId)
    print (searchType)
    return render(request, 'user_profile.html',
                  {'user': request.user,
                  }
                 )