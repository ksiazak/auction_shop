# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-05-06 22:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='miasto',
            name='wartosc',
            field=models.CharField(max_length=48, unique=True),
        ),
    ]