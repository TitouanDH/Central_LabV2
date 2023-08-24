from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Dut,Reservation , Link


class DutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dut
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        
class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'