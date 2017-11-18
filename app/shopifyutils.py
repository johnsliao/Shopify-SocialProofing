import shopify
import ssl
import sys
import os
import django

sys.path.append("..")  # here store is root folder(means parent).
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from app.models import Store

# Overrides the default function for context creation with the function to create an unverified context.
ssl._create_default_https_context = ssl._create_unverified_context


def get_stores():
    """
    Return all store names and permanent tokens as dictionary.
    """
    pass


def ingest_orders(store_name):
    """
    Query each store in database if active and save products to Products table.
    """
    # Authentication
    token = 'fb40ed51a032685beebb71c597502449'
    print(Store.objects.get(store_name=store_name).permanent_token)

    session = shopify.Session(store_name, token)
    shopify.ShopifyResource.activate_session(session)

    # Get orders as a list
    orders = shopify.Order.find()
    print(orders)  # Order list, for example [order(168793374751)]

    # Loop through each order and print out attributes of each order
    for order in orders:
        print(order.__dict__)  # Print all attributes of an order


def ingest_products(store_name):
    # Authentication
    token = 'fb40ed51a032685beebb71c597502449'
    session = shopify.Session(store_name, token)
    shopify.ShopifyResource.activate_session(session)

    # Fetch all product listings
    product_listings = shopify.Product.find()

    # Loop through and print out attributes of each product
    for product_listing in product_listings:
        print(product_listing.__dict__)


if __name__ == '__main__':
    stores = get_stores()

    ingest_orders('michael-john-devs.myshopify.com')
    ingest_products('michael-john-devs.myshopify.com')
