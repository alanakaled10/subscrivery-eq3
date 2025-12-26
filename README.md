# Subscrivery - Equipe Alana Caled, Felipe Trindade, Fernando Vinícius, Julia Cruz

> Solução completa para consumo recorrente de produtos através de assinaturas personalizadas.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-brightgreen)
![NodeJS](https://img.shields.io/badge/Back--End-Node.js%20%2F%20Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![React](https://img.shields.io/badge/Front--End-React-blue)

## 📖 Descrição do Projeto

A **Subscrivery** é uma startup que une o modelo de **Subscription** (Assinatura) com **Delivery** (Entrega). O objetivo deste MVP é conectar consumidores a fornecedores locais (Pet Shops, Mercados, Farmácias), permitindo que o cliente receba produtos essenciais com a frequência que desejar, sem precisar refazer o pedido todo mês.

O sistema permite:
* Cadastro e Autenticação de Usuários e Parceiros.
* Seleção de Planos (Básico, Intermediário, Premium).
* Escolha de Categorias e Fornecedores.
* Gerenciamento de Assinaturas e Endereços de Entrega.
* Dashboard para Parceiros gerenciarem produtos.

---

## 🔗 Link da Aplicação (Deploy) - Clientes

Você pode acessar a versão online da aplicação rodando em produção através do link abaixo:

👉 **[Acessar Subscrivery (Vercel)](Em adamento...)**

## 🔗 Link da Aplicação (Deploy) - Fornecedores

Você pode acessar a versão online da aplicação rodando em produção através do link abaixo:

👉 **[Acessar Subscrivery (Vercel)](https://subscrivery-eq3.vercel.app)**

---

## 🔐 Credenciais de Teste - Clientes

Para testar as funcionalidades de acesso restrito (Área do Parceiro/Fornecedor), utilize os dados abaixo no Login:

| Tipo | E-mail | Senha |
| :--- | :--- | :--- |
| **Parceiro (Em andamento...)** | `Em andamento...` | `Em andamento...` |

## 🔐 Credenciais de Teste - Fornecedores

Para testar as funcionalidades de acesso restrito (Área do Parceiro/Fornecedor), utilize os dados abaixo no Login:

| Tipo | E-mail | Senha |
| :--- | :--- | :--- |
| **Parceiro (Supermecado Central de Cambé )** | `ivone@gmail.com` | `123456789` |

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

**Back-end:**
* **Linguagem:** JavaScript / Node.js
* **Framework:** Express.js (API RESTful)
* **Banco de Dados:** MySQL (TiDB Cloud)
* **Driver/ORM:** MySQL2 / Sequelize (ou querys nativas)

**Front-end:**
* **Linguagem:** JavaScript / React
* **Estilização:** CSS Modules / Styled Components
* **Hospedagem:** Vercel

**Ferramentas:**
* **Modelagem de Dados:** brModelo / HeidiSQL
* **Versionamento:** Git & GitHub
* **API Client:** Axios
* **Deploy Backend:** Render

---

## 📂 Modelagem do Banco de Dados

A estrutura do banco de dados foi planejada para garantir escalabilidade e integridade das assinaturas.

* **MER/DER:** Os diagramas completos estão disponíveis na pasta [`/docs`](./docs) deste repositório.
* **Scripts SQL:** O script de criação das tabelas encontra-se na pasta [`/ModeloFisico`](./docs/ModeloFisico) dentro da pasta [`/docs`](./docs) deste repositório.

---

## 🔧 Instruções de Instalação

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos
* Node.js (v18 ou superior)
* NPM ou Yarn
* Servidor MySQL instalado e rodando (XAMPP, HeidiSQL, MySQL Workbench ou Docker)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/alanakaled10/subscrivery-eq3.git](https://github.com/alanakaled10/subscrivery-eq3.git)
   cd subscrivery-eq3
   ```

2. **Instale as dependências Acesse a pasta do servidor (back-end) e instale os pacotes**
    ```bash
    cd backend
    npm install
    ```

3. **Configure o Banco de Dados**
    * Crie um banco de dados vazio no MySQL chamado `subscrivery_db`.
    * Execute o script SQL disponível em `docs/ModeloFisico` (verifique o nome do arquivo .sql) para criar as tabelas.
    * *(Opcional)* Execute o script de Seeds para popular dados iniciais.

4. **Variáveis de Ambiente (.env)**
    ```ini
    PORT=3000
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=sua_senha_mysql
    DB_NAME=subscrivery
    JWT_SECRET=uma_chave_secreta_para_token
    ```

5. **Instale o Front-end (em outra aba do terminal)**
    ```bash
    cd ../frontend
    npm install
    ```

---

## ⚡ Como Executar

Para rodar a aplicação completa, utilize dois terminais:

**Terminal 1 (Back-end - API):**
```bash
cd backend
npm run dev
# O servidor iniciará em http://localhost:3000
```

**Terminal 2 (Front-end - Web):**
```bash
cd frontend
npm start
# O front iniciará em http://localhost:3000 (ou porta 3001/5173)
```

Desenvolvido pela Equipe Subscrivery EQ3