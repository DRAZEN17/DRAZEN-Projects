from django.urls import path
from . import views

urlpatterns = [
    path("", views.home_page, name='home_page'),
    path("about/", views.about),
    path("categories/", views.categories, name='categories'),
    path("contact/", views.contact),
    path("explore/ <int:category_id>", views.explore, name='explore'),
    path("single_page/ <int:pk>", views.single, name='single'),
    path("signup/", views.signup_views, name='signup'),
    path("login/", views.login_view, name='login'),
]
