from main.models import Aukcja
from api.auctions.serializers import AukcjaSerializer
from rest_framework import viewsets
from rest_framework import filters
import django_filters


class AuctionFilter(filters.FilterSet):
    # min_price = django_filters.NumberFilter(name="priorytet", lookup_type='gte')
    # max_price = django_filters.NumberFilter(name="priorytet", lookup_type='lte')

    class Meta:
        model = Aukcja
        fields = ['id', 'priorytet', 'przedmiot__nazwa', 'przedmiot__gatunek__nazwa']
        # fields = ['id', 'priorytet', 'min_price', 'max_price', 'przedmiot__nazwa', 'przedmiot__gatunek__nazwa']


class AukcjaViewSet(viewsets.ModelViewSet):

    serializer_class = AukcjaSerializer
    queryset = Aukcja.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = AuctionFilter