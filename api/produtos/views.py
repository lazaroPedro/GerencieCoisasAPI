from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ProdutoSerializer
from .models import Produto
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope

class ProdutoViewSet(ModelViewSet):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]

    def get_queryset(self):
        return Produto.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

