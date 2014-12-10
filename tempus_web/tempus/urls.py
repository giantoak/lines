from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()
from tempus import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tempus_web.views.home', name='home'),
    url(r'^internal/get_comparisons/', views.get_comparison, name='get_comparison'),
    url(r'^internal/get_comparisons_upload/', views.get_comparison_upload, name='get_comparison_upload'),
    url(r'^internal/diffindiff/', views.diffindiff, name='diffindiff'),
    url(r'^internal/diffindiff_upload/', views.diffindiff_upload, name='diffindiff_upload'),
    url(r'^internal/upload_ts/', views.save_ts_csv, name='upload_ts'),
    url(r'^home/', views.home, name='home'),
    url(r'^upload_home/', views.upload, name='upload_home'),
    )
