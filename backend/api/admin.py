from django.contrib import admin
from .models import Dut, Reservation, Link

# Register your models here.
admin.site.register(Dut)
admin.site.register(Reservation)
admin.site.register(Link)
