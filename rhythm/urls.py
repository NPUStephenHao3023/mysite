from django.urls import path

from . import views

app_name = 'rhythm'
urlpatterns = [
    path('', views.index, name='index'),
    path('select/', views.select, name='select'),
    path('<str:dataset_name>/<str:method_full_name>/<int:parameter>/', views.results, name='results'),
]
