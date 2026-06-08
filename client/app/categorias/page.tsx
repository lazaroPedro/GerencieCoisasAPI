"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Tags, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import { Categoria, CategoriaTree } from './models/categoria.model';
import { apiFetch } from '@/lib/api';
import CategoriaForm from './modals/categoria.form';
import CategoriaConfirm from './modals/categoria.confirm';

import { BarChart3, Layers, PackageCheck } from 'lucide-react';

export const categoriasApi = {
  listar: () => apiFetch<Categoria[]>("/api/categorias/"),
  criar: (data: Omit<Categoria, "id">) => apiFetch<Categoria>("/api/categorias/", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  atualizar: (id: number, data: Partial<Categoria>) => apiFetch<Categoria>(`/api/categorias/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deletar: (id: number) => apiFetch<void>(`/api/categorias/${id}/`, {
    method: "DELETE",
  }),
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const carregarCategorias = async () => {
    try {
      const dados = await categoriasApi.listar();
      setCategorias(dados);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const montarÁrvore = (lista: Categoria[], parentId: number | null = null): CategoriaTree[] => {
    return lista
      .filter((item) => item.parent === parentId)
      .map((item) => ({
        ...item,
        filhos: montarÁrvore(lista, item.id),
      }));
  };

  const handleOpenCriar = () => {
    setCategoriaEditando(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (cat: Categoria) => {
    setCategoriaEditando(cat);
    setIsModalOpen(true);
  };

  const handleSalvar = async (nome: string, parent: number | null) => {
    try {
      if (categoriaEditando) {
        await categoriasApi.atualizar(categoriaEditando.id, { nome, parent });
      } else {
        await categoriasApi.criar({ nome, parent });
      }
      setIsModalOpen(false);
      carregarCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletar = async (id: number, nome: string) => {
    try {
      await categoriasApi.deletar(id);
      carregarCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCategorias = categorias.length;
  const totalPais = categorias.filter((c) => c.parent === null).length;
  const totalFilhos = totalCategorias - totalPais;

  const RenderRowTree = ({ node, nivel = 0 }: { node: CategoriaTree; nivel: number }) => {
    const temFilhos = node.filhos.length > 0;
    const isExpandido = !!expandedRows[node.id];

    return (
      <>
        <tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
          <td className="px-6 py-3.5">
            <div className="flex items-center" style={{ paddingLeft: `${nivel * 24}px` }}>
              {temFilhos ? (
                <button onClick={() => toggleExpand(node.id)} className="p-1 rounded hover:bg-slate-200 text-slate-500 mr-1">
                  {isExpandido ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <div className="w-6 h-6 mr-1" />
              )}
              <span className={`font-medium ${nivel === 0 ? "text-slate-900 font-bold" : "text-slate-700"}`}>
                {node.nome}
              </span>
            </div>
          </td>
          <td className="px-6 py-3.5 text-right space-x-2 whitespace-nowrap">
            <button onClick={() => handleOpenEditar(node)} className="p-1.5 inline-flex text-blue-600 hover:bg-blue-50 rounded-lg">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={() => {
              setIsConfirmOpen(true);
              setCategoriaEditando(node);
            }} className="p-1.5 inline-flex text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="h-4 w-4" />
            </button>
          </td>
        </tr>
        {temFilhos && isExpandido && node.filhos.map((filho) => (
          <RenderRowTree key={filho.id} node={filho} nivel={nivel + 1} />
        ))}
      </>
    );
  };

  const árvoreCategorias = montarÁrvore(categorias);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tags className="text-primary h-6 w-6" /> Categorias
          </h1>
          <p className="text-sm text-slate-500">Organização hierárquica das suas categorias de produtos.</p>
        </div>
        <button onClick={handleOpenCriar} className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-lg text-primary">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Total Geral</span>
            <span className="text-xl font-bold text-slate-900">{totalCategorias}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <PackageCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Subcategorias</span>
            <span className="text-xl font-bold text-slate-900">{totalFilhos}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nome da Categoria</th>
                <th className="px-6 py-4 text-right w-40">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {árvoreCategorias.length > 0 ? (
                árvoreCategorias.map((raiz) => <RenderRowTree key={raiz.id} node={raiz} nivel={0} />)
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-slate-400">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoriaForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSalvar}
        categorias={categorias}
        categoriaParaEditar={categoriaEditando}
      />
      <CategoriaConfirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onSubmit={(id) => {
          handleDeletar(id, categoriaEditando?.nome || "");
          setCategoriaEditando(null);
        }}
        categoria={categoriaEditando?.nome || ""}
        id={categoriaEditando?.id || 0}
      />
    </div>
  );
}