# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-12-01 19:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_auto_20171130_1842'),
    ]

    operations = [
        migrations.AddField(
            model_name='modal',
            name='scope',
            field=models.TextField(default='product'),
        ),
    ]
