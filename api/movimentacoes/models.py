from django.db import models

class Movimentacao(models.Model):
    produto = models.ManyToManyField('produtos.Produto')
    quantidade = models.IntegerField()
    tipo = models.IntegerField(choices=[(1, 'Entrada'), (-1, 'Saída')])
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.produto.nome} - {self.quantidade}"

