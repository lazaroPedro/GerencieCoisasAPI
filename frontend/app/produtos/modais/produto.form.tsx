"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Produto, CategoriaSimples } from "../models/produto.model";

interface ProdutoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Produto, "id">) => void;
  categorias: CategoriaSimples[];
  produtoParaEditar?: Produto | null;
}

export default function ProdutoForm({
  isOpen,
  onClose,
  onSubmit,
  categorias,
  produtoParaEditar,
}: ProdutoFormProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    if (produtoParaEditar && isOpen) {
      setNome(produtoParaEditar.nome);
      setDescricao(produtoParaEditar.descricao);
      setPreco(produtoParaEditar.preco.toString());
      setFornecedor(produtoParaEditar.fornecedor);
      setQuantidade(produtoParaEditar.quantidade.toString());
      setCategoriaId(produtoParaEditar.categoria.toString());
    } else if (isOpen) {
      setNome("");
      setDescricao("");
      setPreco("");
      setFornecedor("");
      setQuantidade("");
      setCategoriaId("");
    }
  }, [produtoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      descricao,
      preco,
      fornecedor,
      quantidade: parseInt(quantidade),
      categoria: parseInt(categoriaId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <h3 className="font-bold text-slate-900">
            {produtoParaEditar ? "Editar Produto" : "Novo Produto"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Preço</label>
              <input type="number" step="0.01" required value={preco} onChange={(e) => setPreco(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Quantidade Inicial</label>
              <input type="number" required value={quantidade} onChange={(e) => setQuantidade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Fornecedor</label>
            <input type="text" required value={fornecedor} onChange={(e) => setFornecedor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
            <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500">
              <option value="">Selecione uma categoria...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
            <textarea required rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 -mb-6 p-6 bg-slate-50 sticky bottom-0 z-20">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-sm">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}