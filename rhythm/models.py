from django.db import models
from django.utils import timezone

# Create your models here.
class Image(models.Model):
    image_full_name = models.CharField(max_length=256)
    extra_information = models.CharField(max_length=256)
    upload_time = models.DateTimeField('date-time uploaded')

    def __str__(self):
        return self.image_full_name