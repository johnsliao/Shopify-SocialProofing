# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-27 22:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_auto_20171127_2158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apimetrics',
            name='method',
            field=models.TextField(default=0),
        ),
        migrations.AlterUniqueTogether(
            name='apimetrics',
            unique_together=set([('snapshot_date', 'view', 'method')]),
        ),
    ]
