# 📦 Gerencie Coisas

**Trabalho Final: Desenvolvimento de API RESTful Segura**

Este projeto consiste numa aplicação completa para gestão de inventário, desenvolvida para cumprir os requisitos da disciplina. A arquitetura está dividida entre uma API RESTful segura construída com **Django Rest Framework (DRF)** e um cliente independente desenvolvido em **Next.js (React)**.

---

## 📺 Apresentação do Projeto

Confira o vídeo demonstrativo com explicações e o funcionamento do sistema:

[CLIQUE AQUI PARA ASSISTIR AO VÍDEO NO YOUTUBE](https://www.youtube.com/watch?v=z-hYws8CxU4)


## 🎯 Objetivos do Projeto e Cumprimento de Requisitos


### I. API (Backend)
- **Django Rest Framework (DRF):** Utilizado para a construção de toda a API.
- **Segurança (DOT):** Autenticação e controlo de permissões implementados de forma estrita através do **Django OAuth Toolkit (DOT)**.
- **Modelos Relacionados:** A base de dados conta com três modelos interligados: `Categoria`, `Produto` e `Movimentacao`.
- **CRUD Completo:** As rotas oferecem suporte total a operações de Criação, Leitura, Atualização e Eliminação (CRUD).
- **Serializers:** Uso de serializers do DRF para validação e transformação de dados.

### II. Cliente (Frontend)
- **Tecnologia Independente:** Cliente desenvolvido em **Next.js (TypeScript)**, fora do ecossistema Python.
- **Integração Segura:** O cliente realiza login, obtém o *Access Token* (Bearer) e consome as rotas protegidas da API de forma segura.

---

## 🛠️ Tecnologias Utilizadas

**Backend (`/api`):**
- Python 3.12+
- Django & Django Rest Framework
- Django OAuth Toolkit (OAuth2)
- PostgreSQL

**Frontend (`/client`):**
- Next.js (React)
- TypeScript
- Tailwind CSS


**Infraestrutura:**
- Docker & Docker Compose

---




## 🚀 Como Executar o Projeto

A forma mais simples de executar a aplicação em ambiente de desenvolvimento é através do Docker.

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.
- Git.

### 1. Clonar o Repositório e Preparar Variáveis
``` bash
git clone https://github.com/lazaroPedro/GerencieCoisasAPI
cd GerencieCoisasAPI
```

### Crie o arquivo de variáveis de ambiente:

``` bash
cp .env.example .env
```
### Iniciar os Containers com Docker
``` bash
docker compose up --build
```
`Isto irá iniciar o backend (porta 8000) e o frontend (porta 3000).`


### Criar um Usuario Admin

```bash
docker compose exec api uv run python manage.py createsuperuser
```
(Siga as instruções no terminal para definir um nome de utilizador, email e palavra-passe).

## 👥 Integrantes do Grupo

    Caio Alves Nascimento
    Genésio Faustino Teixeira Junior
    Lazaro Pedro Martins Santos
    

Professor: Carlos Anderson
Disciplina: Programação para Web II
