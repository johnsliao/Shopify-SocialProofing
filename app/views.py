from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import redirect
from urllib.parse import urlparse, parse_qs
from django.template import loader
from django.views.decorators.clickjacking import xframe_options_exempt
from django.conf import settings
from django.contrib.staticfiles.templatetags import staticfiles
from django.core.urlresolvers import reverse
from utils import authenticate

from .models import Store, StoreSettings

import shopify
import logging

logger = logging.getLogger(__name__)


@xframe_options_exempt
def index(request):
    """
    This view is the embedded app shown in their store.
    Redirect store owner to correct view based on account status.
    """

    session = authenticate(request)

    try:
        store_name = request.GET['shop']

        exists_in_store_settings_table = StoreSettings.objects.filter(store__store_name=store_name).exists()
        exists_in_store_table = Store.objects.filter(store_name=store_name).exists()

        # Registered app but did not setup store settings yet
        if exists_in_store_table and not exists_in_store_settings_table:
            return HttpResponseRedirect(reverse('setup_wizard'))

        # Registered app and set up store
        elif exists_in_store_table and exists_in_store_settings_table:
            return HttpResponseRedirect(reverse('dashboard'))

        # Redirect to install page
        else:
            return HttpResponseRedirect(reverse('install'))

    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)


def update_data(request):
    """
    Update social proof data in the backend. This will probably call calculate-data route
    """
    return HttpResponse('update_data.')


def calculate_data(request):
    """
    Calculate social proof data in the backend.
    """
    return HttpResponse('calculate_data.')


def setup_wizard(request):
    """
    Calculate social proof data when new store signs up or settings change - new customers. This will probably call calculate-data and update-data routes upon saving their permanent oauth token.
    """
    return HttpResponse('setup wizard.')


def load_logic(request):
    """
    Gets called every time on every page load, has logic to make sure that it doesn’t render on checkout or register.
    """
    return HttpResponse('load_logic.')


def update_settings(request):
    """
    Settings update - anytime a setting is changed for a store (customer) send the data to back
    """
    return HttpResponse('update_settings.')


def dashboard(request):
    """
    Settings update - anytime a setting is changed for a store (customer) send the data to back
    """
    session = authenticate(request)

    template = loader.get_template('app/index.html')
    try:
        shop = request.GET['shop']

        context = {
            'api_key': settings.API_KEY,
            'shop': shop,
        }

        return HttpResponse(template.render(context, request))
    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest('Invalid request parameters')


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
        return HttpResponseBadRequest('<h1>Something bad happened.</h1>')


def auth_callback(request):
    """
    After the user has approved our app, they are redirected from Shopify to us with a temporary code.
    We use this temporary code in exchange for a permanent one with offline access and store it in our db.
    """
    shopify.Session.setup(api_key=settings.API_KEY, secret=settings.API_SECRET)

    try:
        params = {
            'code': request.GET['code'],
            'timestamp': request.GET['timestamp'],
            'hmac': request.GET['hmac'],
            'shop': request.GET['shop']
        }

        session = shopify.Session(params['shop'])
        token = session.request_token(params)
        print('Received permanent token: {}'.format(token))

        # Store permanent token or update if exists in db
        store, created = Store.objects.update_or_create(store_name=params['shop'], defaults={'permanent_token': token})

        # Return the user back to their shop
        return redirect('https://' + params['shop'])
    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest('<h1>Something bad happened.</h1>')
