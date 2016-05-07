from rest_framework import routers
from api.auctions.viewset import AukcjaViewSet

router = routers.DefaultRouter()
router.register(r'aukcje', AukcjaViewSet)
