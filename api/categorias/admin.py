from django.contrib import admin

from .models import Categoria
# Register your models here.

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'parent']
    search_fields = ['nome']
    list_filter = ['parent']
