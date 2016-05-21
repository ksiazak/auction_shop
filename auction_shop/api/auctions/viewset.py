from main.models import Aukcja, Gatunek, StanNowosci, TypAukcji
from api.auctions.serializers import AukcjaSerializer, CategorySerializer, StateSerializer, AuctionTypeSerializer
from rest_framework import viewsets
from rest_framework import filters
import django_filters


def get_category_tree(category_name):
    category_list = []
    category = Gatunek.objects.get(nazwa=category_name)
    category_list.append(category.nazwa)
    subcategories = Gatunek.objects.filter(gatunek_rodzic=category)
    for subcategory in subcategories:
        category_list.append(subcategory.nazwa)
        subsubcategories = Gatunek.objects.filter(gatunek_rodzic=subcategory)
        for subsubcategory in subsubcategories:
            category_list.append(subsubcategory.nazwa)
    return category_list


class AuctionFilter(filters.FilterSet):
    category_items = django_filters.MethodFilter(action='filter_category_items')
    przedmiot__nazwa_contains = django_filters.MethodFilter(action='filter_przedmiot__nazwa_contains')
    typ_aukcji__nazwa_contains = django_filters.MethodFilter(action='filter_typ_aukcji__nazwa_contains')

    class Meta:
        model = Aukcja
        fields = ['przedmiot__gatunek__nazwa',
                  'category_items',
                  'przedmiot__nazwa',
                  'przedmiot__nazwa_contains',
                  'typ_aukcji__nazwa',
                  'typ_aukcji__nazwa_contains'
                 ]

    def filter_category_items(self, queryset, value):
        return queryset.filter(przedmiot__gatunek__nazwa__in=get_category_tree(value))

    def filter_przedmiot__nazwa_contains(self, queryset, value):
        return queryset.filter(przedmiot__nazwa__contains=value)

    def filter_typ_aukcji__nazwa_contains(self, queryset, value):
        return queryset.filter(typ_aukcji__nazwa__contains=value)


class AukcjaViewSet(viewsets.ModelViewSet):

    serializer_class = AukcjaSerializer
    queryset = Aukcja.objects.all()
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter)
    filter_class = AuctionFilter
    ordering_fields = ['cena_minimalna', 'przedmiot__nazwa', 'przedmiot__stan_nowosci__wartosc']

    def list(self, request, *args, **kwargs):
        response = super(AukcjaViewSet, self).list(request, args, kwargs)
        response.data['ordering'] = {
            'Cena': 'cena_minimalna',
            'Nazwa przedmiotu': 'przedmiot__nazwa',
            'Stan nowości': 'przedmiot__stan_nowosci__wartosc',
        }
        response.data['filters'] = {
            'Typ aukcji': 'typ_aukcji__nazwa',
            'Nazwa przedmiotu': 'przedmiot__nazwa',
        }
        return response

class CategoryViewSet(viewsets.ModelViewSet):

    serializer_class = CategorySerializer
    queryset = Gatunek.objects.all()


class StateViewSet(viewsets.ModelViewSet):

    serializer_class = StateSerializer
    queryset = StanNowosci.objects.all()


class AuctionTypeViewSet(viewsets.ModelViewSet):

    serializer_class = AuctionTypeSerializer
    queryset = TypAukcji.objects.all()
