from rest_framework import serializers
from main.models import Aukcja


class AukcjaSerializer(serializers.ModelSerializer):

    przedmiot_nazwa = serializers.CharField(source='przedmiot.nazwa', read_only=True)
    gatunek_nazwa = serializers.CharField(source='przedmiot.gatunek.nazwa', read_only=True)
    typ_aukcji_nazwa = serializers.CharField(source='typ_aukcji.nazwa', read_only=True)
    stan_nowosci = serializers.CharField(source='przedmiot.stan_nowosci.wartosc')
    sprzedajacy = serializers.CharField(source='sprzedawca.username')
    kolor = serializers.SerializerMethodField()

    class Meta:
        model = Aukcja
        fields = ('id', 'przedmiot_nazwa', 'gatunek_nazwa', 'typ_aukcji_nazwa', 'stan_nowosci', 'cena_minimalna',
                  'data_rozpoczecia', 'sprzedajacy', 'kolor',
                  'liczba_wyswietlen', 'czy_zakonczona', 'priorytet')

    def get_kolor(self, obj):
        if obj.typ_aukcji.nazwa == 'Kup teraz!':
            return 'primary'
        elif obj.typ_aukcji.nazwa == 'Holenderska':
            return 'warning'
        elif obj.typ_aukcji.nazwa == 'Angielska':
            return 'success'
        elif obj.typ_aukcji.nazwa == 'Vickerey\'a!':
            return 'danger'
        else:
            return 'default'