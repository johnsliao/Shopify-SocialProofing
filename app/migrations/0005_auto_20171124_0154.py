# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-24 01:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20171123_2002'),
    ]

    operations = [
        migrations.AddField(
            model_name='orders',
            name='country_code',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='orders',
            name='province_code',
            field=models.TextField(default=''),
        ),
    ]
