# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-28 15:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_product_main_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='handle',
            field=models.TextField(default=''),
        ),
    ]
