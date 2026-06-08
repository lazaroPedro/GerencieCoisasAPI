from rest_framework import serializers
from produtos.models import Produto

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ["id", "nome", "descricao", "preco", "fornecedor", "quantidade", "categoria"]