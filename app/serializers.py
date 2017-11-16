from rest_framework import serializers

from .models import Store, StoreSettings


class StoreSerializer(serializers.ModelSerializer):
    #store_settings = serializers.RelatedField()

    class Meta(object):
        model = Store
        exclude = ('permanent_token',)

    def create(self, validated_data):
        """
        Create and return a new `Stores` instance, given the validated data.
        """
        return Store.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Store` instance, given the validated data.
        """
        instance.permanent_token = validated_data.get('active', instance.active)
        instance.save()
        return instance


class StoreSettingsSerializer(serializers.ModelSerializer):
    store = StoreSerializer()
    id = serializers.IntegerField(read_only=True)

    class Meta(object):
        model = StoreSettings

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        """
        Update and return an existing `StoreSettings` instance, given the validated data.
        """
        instance.store_name = validated_data.get('store_name', instance.store_name)
        instance.active = validated_data.get('look_back', instance.look_back)

        instance.save()
        return instance
