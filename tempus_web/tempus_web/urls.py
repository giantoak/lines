from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tempus_web.views.home', name='home'),
    url(r'^tempus/', include('tempus.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
