from rest_framework import routers
from api.auctions.viewset import AukcjaViewSet
from api.items.viewset import PrzedmiotViewSet

router = routers.DefaultRouter()
router.register(r'aukcje', AukcjaViewSet)
router.register(r'przedmioty', PrzedmiotViewSet)
