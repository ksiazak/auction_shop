from rest_framework import serializers
from main.models import Aukcja, ProfilUzytkownika


class AukcjaSerializer(serializers.ModelSerializer):

    item = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()
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
                  'price',
                  'start_date',
                  'finish_date',
                  'entries_count',
                  'if_finished',
                  'priority',
                  'type'
                  )

    def get_item(self, obj):
        item = {
            'name': obj.przedmiot.nazwa,
            'description': obj.przedmiot.opis,
            'state': obj.przedmiot.stan_nowosci.wartosc,
            'category': obj.przedmiot.gatunek.nazwa,

        }
        #przedmiot['categories'] = self.get_categories(obj)
        return item

    def get_seller(self, obj):
        try:
            profile = ProfilUzytkownika.objects.get(uzytkownik=obj.sprzedawca)
            seller = {
                'username': obj.sprzedawca.username,
                'type': profile.typ.wartosc,
                'email': profile.email,
                'name': profile.imie,
                'surname': profile.nazwisko,
                'city': profile.miasto.wartosc,
                'address': {'street': profile.adres.ulica, 'code': profile.adres.kod_pocztowy},
                'house_number': profile.numer_domu
            }
        except Exception:
            seller = {
                'username': obj.sprzedawca.username,
            }
        return seller

    def get_finish_date(self, obj):
        return obj.data_rozpoczecia + obj.czas_trwania

    def get_type(self, obj):
        type = {
            'name': obj.typ_aukcji.nazwa,
            'color': self.get_color(obj)
        }
        return type

    @staticmethod
    def get_color(obj):
        if obj.typ_aukcji.nazwa == 'Kup teraz!':
            return 'primary'
        elif obj.typ_aukcji.nazwa == 'Holenderska':
            return 'warning'
        elif obj.typ_aukcji.nazwa == 'Angielska':
            return 'success'
        elif obj.typ_aukcji.nazwa == 'Vickerey\'a':
            return 'danger'
        else:
            return 'default'

    # @staticmethod
    # def get_categories(obj):
    #     pass
        # categories = {}
        # current_category = obj.gatunek
        # while current_category.gatunek_rodzic:
        #     categories[current_category] = obj.

