from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated,  AllowAny
from .serializers import CategoriaSerializer
from .models import Categoria

class CategoriaViewSet(ModelViewSet):
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Categoria.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)