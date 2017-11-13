import shopify
import logging
from django.http import HttpResponseBadRequest
from django.conf import settings

logger = logging.getLogger(__name__)


def authenticate(request):
    shopify.Session.setup(api_key=settings.API_KEY, secret=settings.API_SECRET)

    try:
        params = {
            'hmac': request.GET['hmac'],
            'locale': request.GET['locale'],
            'protocol': request.GET['protocol'],
            'shop': request.GET['shop'],
            'timestamp': request.GET['timestamp'],
        }

        session = shopify.Session(params['shop'])
        if settings.DEVELOPMENT_MODE == 'PRODUCTION':
            if not session.validate_params(params=params):
                raise Exception('Invalid HMAC: Possibly malicious login')
    except Exception as e:
        logger.error(e)
        return HttpResponseBadRequest('Invalid request parameters.')

    return session