export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: string | number;
  fornecedor: string;
  quantidade: number;
  categoria: number;
}

export interface CategoriaSimples {
  id: number;
  nome: string;
}