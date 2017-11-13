import logging
from urllib.parse import urlparse

import shopify
from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import redirect
from django.template import loader
from django.views.decorators.clickjacking import xframe_options_exempt

from app.utils import authenticate, parse_params
from .models import Store, StoreSettings

logger = logging.getLogger(__name__)


@xframe_options_exempt
def index(request):
    """
    This view is the embedded app shown in their store.
    Redirect store owner to correct view based on account status.
    """

    try:
        session = authenticate(request)
        params = parse_params(request)
        print('PARAMS ARE {}'.format(params))
        store_name = params['shop']

        exists_in_store_settings_table = StoreSettings.objects.filter(store__store_name=store_name).exists()
        exists_in_store_table = Store.objects.filter(store_name=store_name).exists()
        print('shopname {}'.format(store_name))
        print('exists_in_store_settings_table {}'.format(exists_in_store_settings_table))
        print('exists_in_store_table {}'.format(exists_in_store_table))

        # Registered app but did not setup store settings yet
        if exists_in_store_table and not exists_in_store_settings_table:
            return HttpResponseRedirect(reverse('wizard'))

        # Registered app and set up store
        elif exists_in_store_table and exists_in_store_settings_table:
            return HttpResponseRedirect(reverse('dashboard'))

        # Redirect to install page
        else:
            return HttpResponseRedirect(reverse('install'))

    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)


def install(request):
    """
    Redirect user to the shopify page to authenticate our app.
    Example request from: https://mystore.myshopify.com
    """
    try:
        shopify.Session.setup(api_key=settings.API_KEY, secret=settings.API_SECRET)
        shop = urlparse(request.build_absolute_uri())[1]
        session = shopify.Session(shop)
        permission_url = session.create_permission_url(scope=settings.SHOPIFY_API_SCOPE,
                                                       redirect_uri=settings.SHOPIFY_AUTH_CALLBACK_URL)
        return redirect(permission_url)

    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)


def auth_callback(request):
    """
    After the user has approved our app, they are redirected from Shopify to us with a temporary code.
    We use this temporary code in exchange for a permanent one with offline access and store it in our db.
    """
    try:

        session = authenticate(request)
        params = parse_params(request)

        token = session.request_token(params)
        print('Received permanent token: {}'.format(token))

        # Store permanent token or update if exists in db
        store, created = Store.objects.update_or_create(store_name=params['shop'], defaults={'permanent_token': token})

        # Return the user back to their shop
        return redirect('https://' + params['shop'])
    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)

@xframe_options_exempt
def wizard(request):
    """
    Setup wizard.
    """
    session = authenticate(request)
    params = parse_params(request)
    print('PARAMS ARE {}'.format(params))
    return HttpResponse('setup wizard.')

@xframe_options_exempt
def store_settings(request):
    """
    App settings.
    """
    session = authenticate(request)
    params = parse_params(request)
    print('PARAMS ARE {}'.format(params))
    return HttpResponse('Settings page.')

@xframe_options_exempt
def dashboard(request):
    """
    Analytics dashboard.
    """
    session = authenticate(request)
    params = parse_params(request)
    print('PARAMS ARE {}'.format(params))

    template = loader.get_template('app/index.html')
    try:
        shop = params['shop']

        context = {
            'api_key': settings.API_KEY,
            'shop': shop,
        }

        return HttpResponse(template.render(context, request))
    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)
