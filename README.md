# EBD Class API

API RESTful completa para o gerenciamento de Escolas Bíblicas Dominicais (EBD), com foco na organização de classes, lições, professores e automação de escalas. Construída seguindo as melhores práticas e princípios de arquitetura limpa em Node.js.

## 🚀 Tecnologias

- **Node.js** + **Express** - Servidor e Roteamento
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Modelagem de Banco de Dados e Migrations
- **PostgreSQL** - Banco de dados relacional
- **JWT (JSON Web Token)** - Autenticação Stateless
- **Bcrypt** - Criptografia de senhas
- **PDFKit & ExcelJS** - Geração de Relatórios de Escalas

## 🌟 Funcionalidades Principais

* **Autenticação & RBAC (Role-Based Access Control)**:
  * Perfis de Acesso: `SUPERINTENDENTE`, `PASTOR` e `PROFESSOR`.
  * Login seguro e exigência de troca de senha no primeiro acesso.
  * Middleware de restrição de rotas baseado no cargo.
* **Gerenciamento de Classes e Trimestres**:
  * Organização do currículo em trimestres e suas 13 lições dominicais.
  * Professores visualizam apenas turmas às quais estão alocados.
  * Apenas Superintendentes/Pastores podem criar/modificar classes.
* **Geração Automática de Escalas**:
  * Distribuição automática de aulas de um trimestre entre os professores vinculados.
  * Endpoint nativo para listagem e acompanhamento das aulas e seus responsáveis.
* **Trocas de Aula (Máquina de Estados)**:
  * Fluxo padronizado: Solicitação -> Aceite/Rejeite (Substituto) -> Aprovação/Reprovação (Admin).
* **Exportação de Relatórios**:
  * Exportação de escalas 100% preenchidas em formatos PDF e Excel.

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL (Instalado localmente ou em nuvem)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/diegosmoreira/ebd-class-api.git
   cd ebd-class-api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto contendo:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/ebdclass?schema=public"
   JWT_SECRET="sua_chave_secreta_aqui"
   PORT=3000
   ```

4. **Prepare o Banco de Dados (Prisma):**
   Execute as migrations para gerar as tabelas no PostgreSQL e criar o cliente do Prisma.
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Inicie o Servidor:**
   ```bash
   npm run dev
   ```
   A API estará disponível em `http://localhost:3000`.

## 📚 Endpoints Principais

A API é dividida nos seguintes módulos (necessário Token JWT via Header `Authorization: Bearer <token>`):
- `/auth` - Login e Alteração de Senhas.
- `/usuarios` - Criação de admins (Superintendentes/Pastores).
- `/professores` - Gerenciamento de professores e vínculo com classes.
- `/classes` - Criação, leitura e deleção de classes (filtrado por role).
- `/trimestres` - Ciclos de 13 lições. Contém rota `/gerar-escala/:classe_id`.
- `/aulas` - Listagem de aulas com professor responsável.
- `/trocas` - Fluxo de pedido de troca de professor para uma aula.
- `/relatorios` - Download da escala em PDF e Excel.

---
*Desenvolvido para automatizar e profissionalizar o gerenciamento do ensino na EBD.*
