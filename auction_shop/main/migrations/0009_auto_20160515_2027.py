# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-05-15 20:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_auto_20160508_1911'),
    ]

    operations = [
        migrations.AlterField(
            model_name='przedmiot',
            name='zdjecie',
            field=models.URLField(max_length=400),
        ),
    ]
