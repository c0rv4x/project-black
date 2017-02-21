""" Module that keeps models for the Django ORM database """
from django.db import models

class Project(models.Model):
    """ Project model """
    project_name = models.CharField(max_length=200)


class Task(models.Model):
    """ Task model """
    task_type = models.CharField(max_length=50)
    target = models.CharField(max_length=256)
    params = models.CharField(max_length=1024)
    previous_scan = models.IntegerField()
    status = models.CharField(max_length=35)
    project_name = models.ForeignKey(Project, on_delete=models.CASCADE)


class Scope(models.Model):
    """ Scope """
    hostname = models.CharField(max_length=256)
    ip_address = models.CharField(max_length=128)
    project_name = models.CharField(max_length=200)


class Scan(models.Model):
    """ Scan """
    target = models.CharField(max_length=256)
    port_number = models.IntegerField()
    protocol = models.CharField(max_length=64)
    banner = models.CharField(max_length=2048)
    screenshot_path = models.CharField(max_length=256)
    task_id = models.ForeignKey(Task, on_delete=models.DO_NOTHING)
    project_name = models.ForeignKey(Project, on_delete=models.CASCADE)
