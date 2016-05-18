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

    class Meta:
        model = Aukcja
        fields = ['id', 'priorytet', 'przedmiot__nazwa', 'przedmiot__gatunek__nazwa', 'category_items']

    def filter_category_items(self, queryset, value):
        return queryset.filter(przedmiot__gatunek__nazwa__in=get_category_tree(value))


class AukcjaViewSet(viewsets.ModelViewSet):

    serializer_class = AukcjaSerializer
    queryset = Aukcja.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = AuctionFilter


class CategoryViewSet(viewsets.ModelViewSet):

    serializer_class = CategorySerializer
    queryset = Gatunek.objects.all()


class StateViewSet(viewsets.ModelViewSet):

    serializer_class = StateSerializer
    queryset = StanNowosci.objects.all()


class AuctionTypeViewSet(viewsets.ModelViewSet):

    serializer_class = AuctionTypeSerializer
    queryset = TypAukcji.objects.all()
