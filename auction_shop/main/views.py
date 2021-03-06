import json
from collections import OrderedDict

from django.shortcuts import render
from django.utils import timezone
from dateutil import parser
from django.shortcuts import render_to_response, redirect, HttpResponseRedirect, HttpResponse
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.template import RequestContext
from django.views.generic import TemplateView, View
from django.db.models import Avg
from .models import Gatunek, Aukcja, Przedmiot, StanNowosci, WartoscCechyPrzedmiotu, Cecha, TypAukcji


class IndexView(TemplateView):

    def get(self, request):
        context = super(TemplateView, self).get_context_data()
        context['view'] = 'auction_list'
        context['current_path'] = self.get_current_path(request)
        context['categories'] = self.get_categories()
        return render(request, 'index.html', context)

    def get_current_path(self, request):
        return request.get_full_path()

    def get_categories(self):
        categories = {}
        for category in Gatunek.objects.filter(gatunek_rodzic=None):
            categories[category] = {}
            subcategories = Gatunek.objects.filter(gatunek_rodzic=category)
            for subcategory in subcategories:
                categories[category][subcategory] = Gatunek.objects.filter(gatunek_rodzic=subcategory)
        return categories


class BuyItemView(View):
    template_url = 'buy_item/'

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        auction = Aukcja.objects.get(id=data['auction_id'])
        user = User.objects.get(username=request.user.username)
        auction.kupujacy = user
        auction.czy_zakonczona = True
        auction.save()
        return JsonResponse({'buyer': user.username})


class RemoveItemView(View):
    template_url = 'remove_item/'

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        auction = Aukcja.objects.get(id=data['auction_id'])
        auction.delete()
        return JsonResponse({})


class CreateAuctionView(View):
    template_url = 'create_auction/'

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        item = data['newAuction']['item']
        auction = data['newAuction']['auction']
        item_object = Przedmiot(nazwa=item['name'], gatunek=Gatunek.objects.get(nazwa=item['category']['name']),
                         opis=item['description'], zdjecie='static/images/lenovo.jpg',
                         stan_nowosci=StanNowosci.objects.get(wartosc=item['state']),
                        )
        item_object.save()
        features_data = item['category']['category_tree']
        for category, features in features_data.items():
            for feature, value in features.items():
                value_of_feature = WartoscCechyPrzedmiotu(przedmiot=item_object,
                                                          cecha=Cecha.objects.get(nazwa=feature), wartosc=value)
                value_of_feature.save()
        auction = Aukcja(przedmiot=item_object, sprzedawca=User.objects.get(username=request.user.username),
                         cena_minimalna=auction['minPrice'],
                         czas_trwania=(parser.parse(auction['finishDate']) - timezone.now()), czy_zakonczona=False,
                         typ_aukcji=TypAukcji.objects.get(nazwa=auction['type']))
        auction.save()
        return HttpResponse('ok')

class ReportsView(TemplateView):

    def get(self, request):
        context = super(TemplateView, self).get_context_data()
        context['view'] = 'reports'
        return render(request, 'index.html', context)


class AuctionsTypesNumberView(View):
    template_url = 'auction_types_number/'

    def get(self, request):
        types_with_quantity = {}
        types = TypAukcji.objects.all().order_by('nazwa')
        for type in types:
            types_with_quantity[type.nazwa] = len(Aukcja.objects.filter(typ_aukcji=type))
        return JsonResponse(types_with_quantity)


class ItemsSaldoPerUserView(View):
    template_url = 'items_saldo_per_user/'

    def get(self, request):
        bought_and_sold_items = {}
        users = User.objects.all().order_by('username')
        for user in users:
            bought_and_sold_items[user.username] = (len(Aukcja.objects.filter(sprzedawca=user)),
                                                    len(Aukcja.objects.filter(kupujacy=user)))
        return JsonResponse(bought_and_sold_items)

class ItemsPriceInTimeView(View):
    template_url = 'items_price_in_time/'

    def get(self, request):
        now = timezone.now()
        incremented_date = timezone.now() - timezone.timedelta(days=30)
        items_price_in_time = OrderedDict()
        users = User.objects.all().order_by('username')
        while incremented_date < now:
            incremented_date_in_str = str(incremented_date.strftime('%b %d'))
            items_price_in_time[incremented_date_in_str] = {}
            for user in users:
                auctions_on_this_day = Aukcja.objects.filter(sprzedawca=user,
                                                             data_rozpoczecia__year=incremented_date.year,
                                                             data_rozpoczecia__month=incremented_date.month,
                                                             data_rozpoczecia__day=incremented_date.day,
                                                             typ_aukcji=TypAukcji.objects.get(nazwa="Kup teraz!"))
                items_price_in_time[incremented_date_in_str][user.username] = \
                    auctions_on_this_day.aggregate(Avg('cena_minimalna'))
            incremented_date += timezone.timedelta(days=1)
        return JsonResponse(items_price_in_time)


def login_user(request):
    logout(request)
    username = password = ''
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
    return render_to_response('registration/login.html', context_instance=RequestContext(request))


def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/')

