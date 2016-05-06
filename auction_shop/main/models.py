from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Miasto(models.Model):
    wartosc = models.CharField(max_length=48)


class Adres(models.Model):
    ulica = models.CharField(max_length=32)
    kod_pocztowy = models.CharField(max_length=16)


class TypUzytkownika(models.Model):

    OSOBA = 'O'
    FIRMA = 'F'

    TYPY_UZYTKOWNIKA = (
        (OSOBA, 'Osoba'),
        (FIRMA, 'Firma'),
    )

    wartosc = models.CharField(max_length=1, choices=TYPY_UZYTKOWNIKA, default=OSOBA)


class ProfilUzytkownika(models.Model):
    uzytkownik = models.OneToOneField(User, on_delete=models.CASCADE)
    typ = models.ForeignKey(TypUzytkownika)
    email = models.EmailField(max_length=254)
    imie = models.CharField(max_length=32)
    nazwisko = models.CharField(max_length=32)
    miasto = models.ForeignKey(Miasto)
    adres = models.ForeignKey(Adres)
    numer_domu = models.CharField(max_length=8)
    #opiniujacy = models.ManyToManyField(User, through='Opinia', through_fields=('wystawiajacy', 'otrzymujacy'))


class TypAukcji(models.Model):

    KUPNO_SPRZEDAZ = 'nor'
    ANGIELSKA = 'ang'
    HOLENDERSKA = 'hol'
    VICKEREYA = 'vic'

    TYPY_AUKCJI = (
        (KUPNO_SPRZEDAZ, 'Kupno/Sprzedaz'),
        (ANGIELSKA, 'Angielska'),
        (HOLENDERSKA, 'Holenderska'),
        (VICKEREYA, 'Vickerey\'a')
    )
    nazwa = models.CharField(max_length=3, choices=TYPY_AUKCJI, default=KUPNO_SPRZEDAZ)


class StanNowosci(models.Model):

    NOWY = 'n'
    UZYWANY = 'u'

    STANY_NOWOSCI = (
        (NOWY, 'Nowy'),
        (UZYWANY, 'Uzywany')
    )
    wartosc = models.CharField(max_length=1, choices=STANY_NOWOSCI, default=NOWY)


class Cecha(models.Model):
    nazwa = models.CharField(max_length=32, unique=True)


class Gatunek(models.Model):
    nazwa = models.CharField(max_length=32, unique=True)
    cechy = models.ManyToManyField(Cecha)
    gatunek_rodzic = models.ForeignKey('Gatunek')


class Przedmiot(models.Model):
    nazwa = models.CharField(max_length=32)
    gatunek = models.ForeignKey(Gatunek)
    opis = models.CharField(max_length=1000, null=True, blank=True)
    zdjecie = models.ImageField()
    stan_nowosci = models.ForeignKey(StanNowosci)
    cechy = models.ManyToManyField(Cecha, through='WartoscCechyPrzedmiotu', through_fields=('przedmiot', 'cecha'),)


class Aukcja(models.Model):
    przedmiot = models.ForeignKey(Przedmiot)
    sprzedawca = models.ForeignKey(User)
    cena_minimalna = models.DecimalField(max_digits=10, decimal_places=2)
    data_rozpoczecia = models.DateTimeField(auto_now_add=True, blank=True)
    czas_trwania = models.DurationField()
    liczba_wyswietlen = models.IntegerField(default=0)
    czy_zakonczona = models.BooleanField()
    priorytet = models.IntegerField(default=0)
    typ_aukcji = models.ForeignKey(TypAukcji)


class OfertaAukcji(models.Model):
    uzytkownik = models.ForeignKey(User)
    aukcja = models.ForeignKey(Aukcja)
    oferta = models.DecimalField(max_digits=10, decimal_places=2)
    czas = models.DateTimeField(auto_now_add=True, blank=True)


class WartoscCechyPrzedmiotu(models.Model):
    przedmiot = models.ForeignKey(Przedmiot, on_delete=models.CASCADE)
    cecha = models.ForeignKey(Cecha, on_delete=models.CASCADE)
    wartosc = models.CharField(max_length=32)


class Opinia(models.Model):
    wystawiajacy = models.ForeignKey(User, related_name='wystawiajacy')
    otrzymujacy = models.ForeignKey(User, related_name='otrzymujacy')
    wartosc_liczbowa = models.IntegerField()
    opis = models.CharField(max_length=255)
    aukcja = models.ForeignKey(Aukcja)