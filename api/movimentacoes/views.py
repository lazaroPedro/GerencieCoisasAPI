from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import MovimentacaoSerializer
from .models import Movimentacao

class MovimentacaoViewSet(ModelViewSet):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer
    permission_classes = [IsAuthenticated]