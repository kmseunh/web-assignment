from django.db import models


class PmidKeywords(models.Model):
    pmid = models.IntegerField(primary_key=True)
    keyword_info = models.JSONField()
