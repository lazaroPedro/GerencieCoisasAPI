from django.contrib import admin
from .models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'quantidade', 'preco', 'fornecedor', 'categoria']
    search_fields = ['nome', 'fornecedor']
    list_filter = ['categoria']