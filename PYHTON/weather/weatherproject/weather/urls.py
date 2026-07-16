from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='weather-index'),
    path('get_weather', views.get_weather),
]
