from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^parabolic/$', views.parabolic),
    url(r'^hyperbolic/$', views.hyperbolic),
    url(r'^elliptic/$', views.elliptic),
]
