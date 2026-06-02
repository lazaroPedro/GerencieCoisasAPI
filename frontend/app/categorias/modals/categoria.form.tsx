"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Categoria } from "../models/categoria.model";

interface CategoriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nome: string, parentId: number | null) => void;
  categorias: Categoria[];
  categoriaParaEditar?: Categoria | null;
}

export default function CategoriaForm({
  isOpen,
  onClose,
  onSubmit,
  categorias,
  categoriaParaEditar,
}: CategoriaFormProps) {
  const [nome, setNome] = useState(categoriaParaEditar ? categoriaParaEditar.nome : "");
  const [parentId, setParentId] = useState(categoriaParaEditar ? categoriaParaEditar.parent?.toString() || "" : "");


  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nome, parentId === "" ? null : parseInt(parentId));
  };

  const opçõesParent = categorias.filter((cat) =>
    categoriaParaEditar ? cat.id !== categoriaParaEditar.id : true
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">
            {categoriaParaEditar ? "Editar Categoria" : "Nova Categoria"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome da Categoria</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Eletrônicos, Roupas"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Categoria Pai</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-primary"
            >
              <option value="">Nenhuma (Categoria Primária)</option>
              {opçõesParent.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 -mb-6 p-6 bg-slate-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}