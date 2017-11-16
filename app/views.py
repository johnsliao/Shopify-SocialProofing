import logging
from urllib.parse import urlparse

import shopify
from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import redirect
from django.template import loader
from django.views.decorators.clickjacking import xframe_options_exempt

from .utils import authenticate, parse_params, populate_default_settings
from .decorators import shop_login_required
from .models import Store, StoreSettings
from .serializers import StoreSerializer, StoreSettingsSerializer

logger = logging.getLogger(__name__)


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
        logger.info('Received permanent token: {} from {}'.format(token, params['shop']))

        request.session['shopify'] = {
            "shop_url": params['shop']
        }

        # Store permanent token or update if exists in db
        store, created = Store.objects.update_or_create(store_name=params['shop'], defaults={'permanent_token': token})

        # Return the user back to their shop
        return redirect('https://' + params['shop'])
    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)


@xframe_options_exempt
def index(request):
    """
    This view is the entry point for our app in the store owner admin page.
    Redirects store owner to correct view based on account status.
    """

    try:
        session = authenticate(request)
        params = parse_params(request)

        request.session['shopify'] = {
            "shop_url": params['shop']
        }

        store_name = params['shop']

        exists_in_store_settings_table = StoreSettings.objects.filter(store__store_name=store_name).exists()
        exists_in_store_table = Store.objects.filter(store_name=store_name).exists()

        # User not set up yet, i.e. just registered
        if exists_in_store_table and not exists_in_store_settings_table:
            populate_default_settings(store_name)
            return HttpResponseRedirect(reverse('store_settings'))

        # Store has been set up
        if exists_in_store_table and exists_in_store_settings_table:
            return HttpResponseRedirect(reverse('dashboard'))

        return HttpResponseRedirect(reverse('install'))

    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest(e)


@xframe_options_exempt
@shop_login_required
def store_settings(request):
    """
    App settings.
    """
    params = parse_params(request)
    return HttpResponse('Settings page.')


@xframe_options_exempt
@shop_login_required
def dashboard(request):
    """
    Analytics dashboard.
    """
    params = parse_params(request)
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


@xframe_options_exempt
@shop_login_required
def store_settings_api(request, store_name):
    """
    Retrieve, update or delete store settings.
    """

    # Session shop_url must match provided store_name in url
    if store_name != request.session['shopify']['shop_url']:
        return HttpResponse(status=403)

    if request.method == 'GET':
        return

    elif request.method == 'PUT':
        return HttpResponse(status=400)

    elif request.method == 'DELETE':
        return HttpResponse(status=204)
