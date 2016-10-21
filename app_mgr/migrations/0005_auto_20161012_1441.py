# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-10-12 18:41
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app_mgr', '0004_auto_20160629_0252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='content_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType', verbose_name='application owner'),
        ),
        migrations.AlterField(
            model_name='application',
            name='object_id',
            field=models.PositiveIntegerField(null=True, verbose_name='app owner id'),
        ),
    ]
