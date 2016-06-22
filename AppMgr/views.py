from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.views import password_reset, password_reset_confirm
from django.contrib.sites.shortcuts import get_current_site
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings

from django.db import IntegrityError

from axes.decorators import watch_login

from AppMgr.models import UserProfile, Organization, Application, AppVersion

import datetime

# Create your views here.

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
            return render_to_response('registration/register.html', {'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error}, context)

        try:
            user.save()
        except IntegrityError:
            userExists = True
            return render_to_response('registration/register.html', {'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error}, context)

        # Now sort out the UserProfile instance.
        # Since we need to set the user attribute ourselves, we set commit=False.
        # This delays saving the model until we're ready to avoid integrity problems.
        userprofile = UserProfile()
        userprofile.user = user

        # Now we save the UserProfile model instance.
        userprofile.save()

        # Update our variable to tell the template registration was successful.
        registrationSuccessful = True
        # add some logic to log events, log in users directly
        print "successful registration of " + request.POST['email'] +" "+ datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        request.POST['email_to'] = user.email
        request.POST['email_subject'] = 'Welcome to TAP'
        request.POST['email_message'] = 'Your registration was successful!\n\nIn case you forget your password, please go to the following page and reset your password:\n\nhttps://' + get_current_site(request).domain + '/AppMgr/reset/\n\nYour username, in case you\'ve forgotten, is the email address this message was sent to.\n\nThanks for using our site!\n\nThe ' + get_current_site(request).name + ' team'

        # Update this if TAP wants email on registration
        #exp_portal.email.send_email(request)

    #return render_to_response('abcd.html', context)
    return render_to_response('registration/register.html', {'registrationSuccessful': registrationSuccessful, 'userExists': userExists, 'error': error}, context)


def logout_user(request):
    """
    Log users out and re-direct them to the main page.
    """
    logout(request)
    return HttpResponseRedirect('/')

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
                return HttpResponseRedirect('/AppMgr/user_profile')
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your TAP account is disabled.")
        else:
            # Bad login details were provided. So we can't log the user in.
            print "Invalid login details: {0}, {1}".format(email, password)
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

def reset_confirm(request, uidb64=None, token=None):
    return password_reset_confirm(request, template_name='registration/reset_password_confirm.html',
                                  uidb64=uidb64, token=token,
                                  post_reset_redirect=reverse('AppMgr:login'))


def reset(request):
    return password_reset(request, template_name='registration/reset_password_form.html',
                          email_template_name='registration/reset_password_email.html',
                          post_reset_redirect=reverse('AppMgr:reset_sent'),
                          from_email=settings.EMAIL_FROM_NOMINAL_ADDRESS)

def reset_sent(request):
    return render(request, 'registration/reset_password_done.html')

@login_required(login_url='/AppMgr/login')
def view_profile(request):
    user = request.user
    return render(request, 'user_profile.html',
                  {'user': request.user,
                  }
                 )
