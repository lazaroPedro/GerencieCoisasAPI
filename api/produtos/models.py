from django.db import models

class Produto(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    fornecedor = models.CharField(max_length=255)
    quantidade = models.IntegerField()
    categoria = models.ForeignKey('categorias.Categoria', on_delete=models.CASCADE)

    def __str__(self):
        return self.nome
