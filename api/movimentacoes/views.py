from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import MovimentacaoSerializer
from .models import Movimentacao
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum


class MovimentacaoViewSet(ModelViewSet):
    """
    CRUD de movimentações de estoque.
    Permissão: AllowAny temporário — será substituído por DOT (OAuth2) na etapa final.
    """
    serializer_class = MovimentacaoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Movimentacao.objects.select_related('produto').order_by('-data')

        produto_id = self.request.query_params.get('produto')
        if produto_id:
            qs = qs.filter(produto_id=produto_id)

        tipo = self.request.query_params.get('tipo')
        if tipo in ('1', '-1'):
            qs = qs.filter(tipo=int(tipo))

        return qs

    @action(detail=False, methods=['get'], url_path='resumo')
    def resumo(self, request):
        """GET /api/movimentacoes/resumo/ — totais de entradas e saídas."""
        entradas = (
            Movimentacao.objects.filter(tipo=Movimentacao.ENTRADA)
            .aggregate(total=Sum('quantidade'))['total'] or 0
        )
        saidas = (
            Movimentacao.objects.filter(tipo=Movimentacao.SAIDA)
            .aggregate(total=Sum('quantidade'))['total'] or 0
        )
        return Response({'entradas': entradas, 'saidas': saidas})