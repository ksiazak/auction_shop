from rest_framework import routers
from api.auctions.viewset import AukcjaViewSet, CategoryViewSet, StateViewSet, AuctionTypeViewSet
from api.items.viewset import PrzedmiotViewSet

router = routers.DefaultRouter()
router.register(r'aukcje', AukcjaViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'states', StateViewSet)
router.register(r'auction_types', AuctionTypeViewSet)
