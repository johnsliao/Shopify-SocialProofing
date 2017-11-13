"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^install/?$', views.install, name='install'),
    url(r'^update_data/?$', views.update_data, name='update_data'),
    url(r'^calculate_data/?$', views.calculate_data, name='calculate_data'),
    url(r'^setup_wizard/?$', views.setup_wizard, name='setup_wizard'),
    url(r'^load_logic/?$', views.load_logic, name='load_logic'),
    url(r'^update_settings/?$', views.update_settings, name='update_settings'),
    url(r'^dashboard/?$', views.dashboard, name='dashboard'),
    url(r'^auth/callback/?$', views.auth_callback, name='auth_callback'),
]
