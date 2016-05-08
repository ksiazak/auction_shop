import json

from django.shortcuts import render
from django.shortcuts import render_to_response, redirect, HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.template import RequestContext
from django.views.generic import TemplateView, View
from .models import Gatunek, Aukcja


class IndexView(TemplateView):

    def get(self, request):
        context = super(TemplateView, self).get_context_data()
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
        return HttpResponse('ok')


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

