# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-12-19 20:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0027_auto_20171219_1916'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webhooks',
            name='webhook_id',
            field=models.TextField(default=''),
        ),
    ]