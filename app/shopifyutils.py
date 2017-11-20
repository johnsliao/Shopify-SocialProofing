import shopify
import ssl
import sys
import os
import django

sys.path.append("..")  # here store is root folder(means parent).
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from app.models import Store, Product

# Overrides the default function for context creation with the function to create an unverified context.
ssl._create_default_https_context = ssl._create_unverified_context


def get_stores():
    """
    Return all store names and permanent tokens as dictionary.
    """
    return Store.objects.all().values('store_name', 'permanent_token', 'active')


def ingest_orders(stores_obj):
    """
    Query each store in database if active and save products to Products table.
    """

    session = shopify.Session(stores_obj['store_name'], stores_obj['permanent_token'])
    shopify.ShopifyResource.activate_session(session)

    orders = shopify.Order.find()

    for order in orders:
        print(order.__dict__)


def ingest_products(stores_obj):
    session = shopify.Session(stores_obj['store_name'], stores_obj['permanent_token'])
    shopify.ShopifyResource.activate_session(session)

    product_listings = shopify.Product.find()

    for product_listing in product_listings:
        product_id = product_listing.id
        product_name = product_listing.title

        store = Store.objects.get(store_name=stores_obj['store_name'])
        Product.objects.update_or_create(product_id=product_id, store__store_name=stores_obj['store_name'],
                                         defaults={'product_name': product_name, 'store': store})


if __name__ == '__main__':
    stores_objs = get_stores()
    for stores_obj in stores_objs:
        if stores_obj['active']:
            ingest_orders(stores_obj)
            ingest_products(stores_obj)

        exit(1)
