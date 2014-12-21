from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()
from tempus import views
from tempus.views import CsvListView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tempus_web.views.home', name='home'),
    url(r'^internal/get_comparisons/', views.get_comparison, name='get_comparison'),
    url(r'^internal/get_comparisons_upload/(?P<file_id>\d+)/', views.get_comparison_upload, name='get_comparison_upload'),
    url(r'^internal/get_diffindiff_upload/(?P<file_id>\d+)/', views.get_diffindiff_upload, name='get_diffindiff_upload'),
    url(r'^internal/diffindiff/', views.diffindiff, name='diffindiff'),
    #url(r'^internal/diffindiff_upload/', views.diffindiff_upload, name='diffindiff_upload'),
    url(r'^internal/upload_ts/', views.save_ts_csv, name='upload_ts'),
    url(r'^home/', views.home, name='home'),
    url(r'^upload_home/', views.upload, name='upload_home'),
    url(r'^loaded/(?P<panel_id>\d+)/(?P<features_id>\d+)/', views.loaded, name='loaded_home'),
    url(r'^select/', views.select, name='select'),
    url(r'^files/(?P<page>\d+)/$', CsvListView.as_view(), name='csv_list'),
    )
