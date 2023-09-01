
from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('login/', views.login),
    path('signup/', views.signup),
    path('create_reservation/', views.create_reservation),
    path('delete_reservation/<str:pk>/', views.delete_reservation),
    path('update_reservation/<str:pk>/', views.update_reservation),
    path('list_reservation/all/', views.list_all_reservation),
    path('view/stats/', views.stats),
    path('list_reservation/', views.list_reservation_by_user),
    path('list_reservation/<str:pk>/', views.list_reservation_by_id),
    path('reserve/', views.reserve),
    path('release/', views.release),
    path('connect/', views.connect),
    path('disconnect/', views.disconnect),
    path('list_dut/all/', views.list_dut_state),
    path('list_dut/', views.list_dut_by_reservation),
    path('list_link/', views.list_link_by_dut),
    path('test_token/', views.test_token),
    path('', views.welcome),
]
