from django.contrib import admin
from .models import Movimentacao


@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ['id', 'produto', 'tipo', 'quantidade', 'data', 'observacao']
    list_filter = ['tipo', 'data']
    search_fields = ['produto__nome', 'observacao']
    readonly_fields = ['data']
    ordering = ['-data']
# Register your models here.
