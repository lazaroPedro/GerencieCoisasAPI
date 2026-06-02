"use client";

import React from "react";
import { X } from "lucide-react";

interface ProdutoConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number) => void;
  produtoNome: string;
  id: number;
}

export default function ProdutoConfirm({
  isOpen,
  onClose,
  onSubmit,
  produtoNome,
  id,
}: ProdutoConfirmProps) {
  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">
            Tem certeza que deseja excluir este produto?
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
            <input
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-primary"
              value={produtoNome}
              disabled
            />
          </div>

          <p className="text-sm text-slate-500">
            Esta ação não pode ser desfeita. Tem certeza que deseja excluir este produto do estoque?
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 -mb-6 p-6 bg-slate-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm">
              Excluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}