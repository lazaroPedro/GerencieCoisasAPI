from django.db import models

class Categoria(models.Model):
    nome = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)


    def __str__(self):
        return self.nome



