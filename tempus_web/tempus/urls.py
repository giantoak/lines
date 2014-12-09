from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()
from tempus import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tempus_web.views.home', name='home'),
    url(r'^internal/get_comparisons/', views.get_comparison, name='get_comparison'),
    url(r'^home/', views.home, name='home'),
)
