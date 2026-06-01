from django.db import models

class Movimentacao(models.Model):
    ENTRADA = 1
    SAIDA = -1
    TIPO_CHOICES = [(ENTRADA, 'Entrada'), (SAIDA, 'Saída')]

    produto = models.ForeignKey(
        'produtos.Produto',
        on_delete=models.PROTECT,
        related_name='movimentacoes',
    )
    quantidade = models.PositiveIntegerField()
    tipo = models.IntegerField(choices=TIPO_CHOICES)
    data = models.DateTimeField(auto_now_add=True)
    observacao = models.TextField(blank=True, default='')

    def __str__(self):
        tipo_label = 'Entrada' if self.tipo == self.ENTRADA else 'Saída'
        return f"{tipo_label} - {self.produto.nome} - {self.quantidade}"