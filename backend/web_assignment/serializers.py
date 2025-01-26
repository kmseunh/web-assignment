from rest_framework import serializers

from .models import PmidKeywords


class PmidKeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PmidKeywords
        fields = "__all__"
