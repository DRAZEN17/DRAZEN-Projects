from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)
    picture = models.ImageField(upload_to='categories/', blank=True, null=True)
    description = models.TextField()
    about = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    

class Blog(models.Model):
    title = models.CharField(max_length=300)
    sub_title = models.CharField(max_length=200, blank=True, null=True)
    date_published = models.DateTimeField(auto_now_add=True)
    Category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='blog')
    picture = models.ImageField(upload_to='blogs/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    body = models.TextField()
    publisher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    publisher_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title