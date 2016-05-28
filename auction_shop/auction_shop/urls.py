"""auction_shop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.conf.urls import url, include
from main.views import IndexView, BuyItemView, RemoveItemView, CreateAuctionView, ReportsView, login_user, logout_user, \
    AuctionsTypesNumberView, ItemsSaldoPerUserView, ItemsPriceInTimeView
from api.routers import router


urlpatterns = [
    url(r'^admin/', admin.site.urls, name='admin'),
    url(r'^login/$', login_user, name='login'),
    url(r'^logout/$', logout_user, name='logout'),
    url(r'^api/', include(router.urls)),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^buy_item/$', BuyItemView.as_view(), name='buy_item'),
    url(r'^remove_item/$', RemoveItemView.as_view(), name='remove_item'),
    url(r'^create_auction/$', CreateAuctionView.as_view(), name='create_auction'),
    url(r'^reports/$', ReportsView.as_view(), name='reports'),
    url(r'^auction_types_number/$', AuctionsTypesNumberView.as_view(), name='auction_types_number'),
    url(r'^items_saldo_per_user/$', ItemsSaldoPerUserView.as_view(), name='items_saldo_per_user'),
    url(r'^items_price_in_time/$', ItemsPriceInTimeView.as_view(), name='items_price_in_time'),
    url(r'^', IndexView.as_view(template_name="index.html"), name='index'),

]

