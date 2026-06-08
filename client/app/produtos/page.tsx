"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Package, Layers, CircleDollarSign } from 'lucide-react';
import { Produto, CategoriaSimples } from './models/produto.model';
import { apiFetch } from '@/lib/api';
import ProdutoForm from './modais/produto.form';
import ProdutoConfirm from './modais/produto.confirm';

export const produtosApi = {
  listar: () => apiFetch<Produto[]>("/api/produtos/"),
  criar: (data: Omit<Produto, "id">) => apiFetch<Produto>("/api/produtos/", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  atualizar: (id: number, data: Partial<Produto>) => apiFetch<Produto>(`/api/produtos/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deletar: (id: number) => apiFetch<void>(`/api/produtos/${id}/`, {
    method: "DELETE",
  }),
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaSimples[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const carregarDados = async () => {
    try {
      const [dadosProdutos, dadosCategorias] = await Promise.all([
        produtosApi.listar(),
        apiFetch<CategoriaSimples[]>("/api/categorias/")
      ]);
      setProdutos(dadosProdutos);
      setCategorias(dadosCategorias);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleOpenCriar = () => {
    setProdutoEditando(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (prod: Produto) => {
    setProdutoEditando(prod);
    setIsModalOpen(true);
  };

  const handleSalvar = async (data: Omit<Produto, "id">) => {
    try {
      if (produtoEditando) {
        await produtosApi.atualizar(produtoEditando.id, data);
      } else {
        await produtosApi.criar(data);
      }
      setIsModalOpen(false);
      carregarDados();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const handleDeletar = async (id: number) => {
    try {
      await produtosApi.deletar(id);
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  };

  const getNomeCategoria = (id: number) => {
    const cat = categorias.find(c => c.id === id);
    return cat ? cat.nome : "Sem categoria";
  };

  // Estatísticas do topo
  const totalProdutos = produtos.length;
  const estoqueTotal = produtos.reduce((acc, curr) => acc + curr.quantidade, 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-orange-500 h-6 w-6" /> Produtos
          </h1>
          <p className="text-sm text-slate-500">Gerencie o seu catálogo de produtos e fornecedores.</p>
        </div>
        <button onClick={handleOpenCriar} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors">
          <Plus className="h-4 w-4" /> Novo Produto
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Itens no Catálogo</span>
            <span className="text-xl font-bold text-slate-900">{totalProdutos}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Total em Estoque</span>
            <span className="text-xl font-bold text-slate-900">{estoqueTotal} un.</span>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nome do Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4 text-right">Preço</th>
                <th className="px-6 py-4 text-center">Estoque</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {produtos.length > 0 ? (
                produtos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{prod.nome}</td>
                    <td className="px-6 py-3.5 text-slate-600">{getNomeCategoria(prod.categoria)}</td>
                    <td className="px-6 py-3.5 text-slate-600">{prod.fornecedor}</td>
                    <td className="px-6 py-3.5 text-slate-900 font-medium text-right">R$ {Number(prod.preco).toFixed(2)}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prod.quantidade > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.quantidade}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleOpenEditar(prod)} className="p-1.5 inline-flex text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => {
                        setIsConfirmOpen(true);
                        setProdutoEditando(prod);
                      }} className="p-1.5 inline-flex text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Nenhum produto cadastrado no catálogo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProdutoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSalvar}
        categorias={categorias}
        produtoParaEditar={produtoEditando}
      />
      <ProdutoConfirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onSubmit={(id) => {
          handleDeletar(id);
          setProdutoEditando(null);
        }}
        produtoNome={produtoEditando?.nome || ""}
        id={produtoEditando?.id || 0}
      />
    </div>
  );
}