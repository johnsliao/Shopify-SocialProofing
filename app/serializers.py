from rest_framework import serializers

from .models import Store, StoreSettings, Modal


class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = StoreSettings
        fields = ('__all__')


class ModalSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Modal
        fields = ('__all__')


class StoreSerializer(serializers.ModelSerializer):
    store_settings = StoreSettingsSerializer(source='storesettings_set')

    # modal = ModalSerializer(many=True, read_only=True)

    class Meta(object):
        model = Store
        exclude = ('permanent_token',)