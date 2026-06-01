"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { ArrowDownCircle, ArrowUpCircle, Plus, X, RefreshCw, PackageOpen } from "lucide-react";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
}

interface Movimentacao {
  id: number;
  produto: number;
  produto_nome: string;
  quantidade: number;
  tipo: 1 | -1;
  tipo_label: string;
  observacao: string;
  data: string;
}

interface Resumo {
  entradas: number;
  saidas: number;
}

interface FormState {
  produto: string;
  quantidade: string;
  tipo: "1" | "-1";
  observacao: string;
}

const FORM_INICIAL: FormState = {
  produto: "",
  quantidade: "",
  tipo: "1",
  observacao: "",
};

// ─── Utilitários ─────────────────────────────────────────────────────────────

function formatData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [resumo, setResumo] = useState<Resumo>({ entradas: 0, saidas: 0 });
  const [filtroTipo, setFiltroTipo] = useState<"" | "1" | "-1">("");
  const [filtroProduto, setFiltroProduto] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_INICIAL);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // ── Carregamento ──────────────────────────────────────────────────────────

  const carregarMovimentacoes = useCallback(async () => {
    const params = new URLSearchParams();
    if (filtroTipo) params.set("tipo", filtroTipo);
    if (filtroProduto) params.set("produto", filtroProduto);
    const query = params.toString() ? `?${params}` : "";
    const data = await apiFetch<Movimentacao[]>(`/api/movimentacoes/${query}`);
    setMovimentacoes(data);
  }, [filtroTipo, filtroProduto]);

  const carregarResumo = async () => {
    const data = await apiFetch<Resumo>("/api/movimentacoes/resumo/");
    setResumo(data);
  };

  const carregarProdutos = async () => {
    const data = await apiFetch<Produto[]>("/api/produtos/");
    setProdutos(data);
  };

  useEffect(() => {
    (async () => {
      setCarregando(true);
      try {
        await Promise.all([carregarMovimentacoes(), carregarResumo(), carregarProdutos()]);
      } finally {
        setCarregando(false);
      }
    })();
  }, [carregarMovimentacoes]);

  // ── Formulário ────────────────────────────────────────────────────────────

  function abrirModal() {
    setForm(FORM_INICIAL);
    setErros({});
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErros((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novosErros: Record<string, string> = {};

    if (!form.produto) novosErros.produto = "Selecione um produto.";
    if (!form.quantidade || Number(form.quantidade) <= 0)
      novosErros.quantidade = "Informe uma quantidade válida.";

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setSalvando(true);
    try {
      await apiFetch("/api/movimentacoes/", {
        method: "POST",
        body: JSON.stringify({
          produto: Number(form.produto),
          quantidade: Number(form.quantidade),
          tipo: Number(form.tipo),
          observacao: form.observacao,
        }),
      });
      fecharModal();
      await Promise.all([carregarMovimentacoes(), carregarResumo(), carregarProdutos()]);
    } catch (err: unknown) {
      const apiErr = err as { body?: Record<string, string[]> };
      if (apiErr?.body) {
        const mapeados: Record<string, string> = {};
        for (const [campo, msgs] of Object.entries(apiErr.body)) {
          mapeados[campo] = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
        }
        setErros(mapeados);
      } else {
        setErros({ geral: "Erro inesperado. Tente novamente." });
      }
    } finally {
      setSalvando(false);
    }
  }

  // ── Produto selecionado no form ────────────────────────────────────────────

  const produtoSelecionado = produtos.find((p) => String(p.id) === form.produto);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Movimentações</h1>
          <p className="text-sm text-slate-500 mt-1">Controle de entradas e saídas do estoque</p>
        </div>
        <button
          onClick={abrirModal}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nova Movimentação
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <ArrowUpCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Entradas</p>
            <p className="text-2xl font-bold text-slate-800">{resumo.entradas.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <ArrowDownCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Saídas</p>
            <p className="text-2xl font-bold text-slate-800">{resumo.saidas.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <PackageOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Saldo</p>
            <p className={`text-2xl font-bold ${resumo.entradas - resumo.saidas >= 0 ? "text-slate-800" : "text-red-600"}`}>
              {(resumo.entradas - resumo.saidas).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as "" | "1" | "-1")}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Todos os tipos</option>
          <option value="1">Entradas</option>
          <option value="-1">Saídas</option>
        </select>

        <select
          value={filtroProduto}
          onChange={(e) => setFiltroProduto(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Todos os produtos</option>
          {produtos.map((p) => (
            <option key={p.id} value={String(p.id)}>{p.nome}</option>
          ))}
        </select>

        <button
          onClick={async () => {
            setCarregando(true);
            await Promise.all([carregarMovimentacoes(), carregarResumo()]);
            setCarregando(false);
          }}
          className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Carregando...
          </div>
        ) : movimentacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <PackageOpen className="h-10 w-10 opacity-40" />
            <p className="text-sm">Nenhuma movimentação encontrada.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Tipo</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Produto</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Quantidade</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Observação</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movimentacoes.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                      ${m.tipo === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}>
                      {m.tipo === 1
                        ? <ArrowUpCircle className="h-3.5 w-3.5" />
                        : <ArrowDownCircle className="h-3.5 w-3.5" />
                      }
                      {m.tipo_label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{m.produto_nome}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-700">
                    {m.tipo === 1 ? "+" : "−"}{m.quantidade}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">{m.observacao || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{formatData(m.data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={fecharModal} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Nova Movimentação</h2>
              <button onClick={fecharModal} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {erros.geral && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erros.geral}</p>
              )}

              {/* Tipo */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  {([["1", "Entrada", "green"], ["-1", "Saída", "red"]] as const).map(([val, label, color]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, tipo: val as "1" | "-1" }))}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all
                        ${form.tipo === val
                          ? color === "green"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-red-500 bg-red-50 text-red-600"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      {val === "1"
                        ? <ArrowUpCircle className="h-4 w-4" />
                        : <ArrowDownCircle className="h-4 w-4" />
                      }
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Produto */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Produto</label>
                <select
                  name="produto"
                  value={form.produto}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300
                    ${erros.produto ? "border-red-400" : "border-slate-200"}`}
                >
                  <option value="">Selecione...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.nome} — estoque: {p.quantidade}
                    </option>
                  ))}
                </select>
                {erros.produto && <p className="text-xs text-red-500 mt-1">{erros.produto}</p>}
                {produtoSelecionado && (
                  <p className="text-xs text-slate-400 mt-1">
                    Estoque atual: <span className="font-semibold text-slate-600">{produtoSelecionado.quantidade}</span> unidades
                  </p>
                )}
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quantidade</label>
                <input
                  type="number"
                  name="quantidade"
                  value={form.quantidade}
                  onChange={handleChange}
                  min={1}
                  placeholder="0"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300
                    ${erros.quantidade ? "border-red-400" : "border-slate-200"}`}
                />
                {erros.quantidade && <p className="text-xs text-red-500 mt-1">{erros.quantidade}</p>}
                {/* Aviso visual de estoque insuficiente antes de submeter */}
                {form.tipo === "-1" && produtoSelecionado && Number(form.quantidade) > produtoSelecionado.quantidade && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠ Quantidade maior que o estoque disponível ({produtoSelecionado.quantidade}).
                  </p>
                )}
              </div>

              {/* Observação */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Observação <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ex: reposição de estoque, venda, ajuste..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Erro de estoque vindo da API */}
              {erros.quantidade && erros.quantidade.includes("Estoque") && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erros.quantidade}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-lg transition-colors"
                >
                  {salvando ? "Salvando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}