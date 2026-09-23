from django.urls import path
from . import views

urlpatterns = [
    path('api/login/', views.login),
    path('api/signup/', views.signup),

    path('api/books/', views.get_books),
    path('api/books/add/', views.add_book),
    path('api/books/edit/<int:id>/', views.edit_book),
    path('api/books/delete/<int:id>/', views.delete_book),
]