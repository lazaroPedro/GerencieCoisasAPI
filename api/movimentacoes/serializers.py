from rest_framework import serializers
from django.db import transaction

from movimentacoes.models import Movimentacao
from produtos.models import Produto


class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    tipo_label = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Movimentacao
        fields = [
            'id',
            'produto',
            'produto_nome',
            'quantidade',
            'tipo',
            'tipo_label',
            'observacao',
            'data',
        ]
        read_only_fields = ['data', 'produto_nome', 'tipo_label']

    def validate(self, attrs):
        produto: Produto = attrs['produto']
        quantidade: int = attrs['quantidade']
        tipo: int = attrs['tipo']

        if tipo == Movimentacao.SAIDA:
            if produto.quantidade < quantidade:
                raise serializers.ValidationError({
                    'quantidade': (
                        f"Estoque insuficiente. "
                        f"Disponível: {produto.quantidade}, solicitado: {quantidade}."
                    )
                })

        return attrs

    def create(self, validated_data):
        with transaction.atomic():
            produto: Produto = validated_data['produto']
            quantidade: int = validated_data['quantidade']
            tipo: int = validated_data['tipo']

            produto_lock = Produto.objects.select_for_update().get(pk=produto.pk)
            produto_lock.quantidade += tipo * quantidade
            produto_lock.save(update_fields=['quantidade'])

            movimentacao = Movimentacao.objects.create(**validated_data)
            return movimentacao