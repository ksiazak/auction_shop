from rest_framework import serializers
from main.models import Aukcja, ProfilUzytkownika, WartoscCechyPrzedmiotu, Gatunek, StanNowosci, TypAukcji
from collections import OrderedDict


def get_categories_tree_in_dict(item, category):
    categories = OrderedDict()
    current_category = category
    while True:
        categories[current_category.nazwa] = {}
        features_from_category = current_category.cechy.all()
        for feature in features_from_category:
            try:
                item_feature = WartoscCechyPrzedmiotu.objects.get(przedmiot=item, cecha=feature)
                categories[current_category.nazwa][feature.nazwa] = item_feature.wartosc
            except Exception:
                categories[current_category.nazwa][feature.nazwa] = ""
        if current_category.gatunek_rodzic:
            current_category = current_category.gatunek_rodzic
        else:
            return categories


class AukcjaSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()
    buyer = serializers.SerializerMethodField()
    price = serializers.DecimalField(source='cena_minimalna', max_digits=10, decimal_places=2, read_only=True)
    start_date = serializers.DateTimeField(source='data_rozpoczecia', read_only=True)
    finish_date = serializers.SerializerMethodField()
    entries_count = serializers.IntegerField(source='liczba_wyswietlen')
    if_finished = serializers.BooleanField(source='czy_zakonczona')
    priority = serializers.IntegerField(source='priorytet')
    type = serializers.SerializerMethodField()

    class Meta:
        model = Aukcja
        fields = ('id',
                  'item',
                  'seller',
                  'buyer',
                  'price',
                  'start_date',
                  'finish_date',
                  'entries_count',
                  'if_finished',
                  'priority',
                  'type',
                  )

    def get_item(self, obj):
        item = {
            'name': obj.przedmiot.nazwa,
            'description': obj.przedmiot.opis,
            'state': obj.przedmiot.stan_nowosci.wartosc,
            'categories': self.get_categories(obj),
            'image_url': obj.przedmiot.zdjecie,

        }
        return item

    def get_seller(self, obj):
        return self.get_user(obj.sprzedawca)

    def get_buyer(self, obj):
        if obj.kupujacy:
            return self.get_user(obj.kupujacy)
        else:
            return {}

    def get_user(self, user):
        try:
            profile = ProfilUzytkownika.objects.get(uzytkownik=user)
            user_info = {
                'username': user.username,
                'type': profile.typ.wartosc,
                'email': profile.email,
                'name': profile.imie,
                'surname': profile.nazwisko,
                'city': profile.miasto.wartosc,
                'address': {'street': profile.adres.ulica, 'code': profile.adres.kod_pocztowy},
                'house_number': profile.numer_domu
            }
        except Exception:
            user_info = {
                'username': user.username,
            }
        return user_info

    @staticmethod
    def get_finish_date(obj):
        return obj.data_rozpoczecia + obj.czas_trwania

    def get_type(self, obj):
        color, action = self.get_type_info(obj)
        type = {
            'name': obj.typ_aukcji.nazwa,
            'color': color,
            'action': action,
        }
        return type

    @staticmethod
    def get_type_info(obj):
        if obj.typ_aukcji.nazwa == 'Kup teraz!':
            return 'primary', 'Kup teraz!'
        elif obj.typ_aukcji.nazwa == 'Holenderska':
            return 'warning', 'Licytuj'
        elif obj.typ_aukcji.nazwa == 'Angielska':
            return 'success', 'Licytuj'
        elif obj.typ_aukcji.nazwa == 'Vickerey\'a':
            return 'danger', 'Licytuj'
        else:
            return 'default', 'Kup'

    @staticmethod
    def get_categories(obj):
        return get_categories_tree_in_dict(obj.przedmiot, obj.przedmiot.gatunek)


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='nazwa')
    category_tree = serializers.SerializerMethodField()

    class Meta:
        model = Gatunek
        fields = ('name',
                  'category_tree'
                  )

    @staticmethod
    def get_category_tree(obj):
        return get_categories_tree_in_dict(None, obj)


class StateSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()

    class Meta:
        model = StanNowosci
        fields = ('value',
                 )

    @staticmethod
    def get_value(obj):
        return obj.wartosc


class AuctionTypeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = TypAukcji
        fields = ('name',
                 )

    @staticmethod
    def get_name(obj):
        return obj.nazwa
