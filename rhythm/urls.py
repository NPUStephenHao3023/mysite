from django.urls import path

from . import views

app_name = 'rhythm'
urlpatterns = [
    path('', views.index, name='index'),
    path('index_association/', views.index_association, name='index_association'),
    path('index_others/', views.index_others, name='index_others'),
    path('select/', views.select, name='select'),
    path('index_association/frequent_mining/',
         views.frequent_mining, name='frequent_mining'),
    path('index_association/sequential_mining/',
         views.sequential_mining, name='sequential_mining'),
    path('test', views.index_test, name='index_test'),
    path('upload_csv', views.upload_csv, name='upload_csv'),
    path('index_association/upload_od', views.upload_od, name='upload_od'),
    path('index_association/upload_traj',
         views.upload_traj, name='upload_traj'),
]
# urlpatterns = [
# path('', views.index, name='index'),
# path('test', views.index_test, name='index'),
# path('index_association/', views.index_association, name='index_association'),
# path('index_to_generate_image/', views.index_to_generate_image,
#  name='index_to_generate_image'),
# path('select/', views.select, name='select'),
# path('select_to_generate_image/', views.select_to_generate_image, name='select_to_generate_image'),
# path('<str:dataset_name>/<str:method_full_name>/<int:parameter>/',
#      views.results, name='results'),
# ]
