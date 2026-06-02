export interface Categoria {
  id: number;
  nome: string;
  parent: number | null; 
}
export interface CategoriaTree extends Categoria {
  filhos: CategoriaTree[];
}