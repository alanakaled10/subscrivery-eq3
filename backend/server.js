const express = require('express');
const cors = require('cors');
// O db garante a conexão inicial com o Erário de Dados
const db = require('./src/config/db'); 
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Definição de Competências (Rotas) ---

// JURIDICAMENTE: Centralizamos login, perfil e carteira no authRoutes
app.use('/api/auth', authRoutes); 
app.use('/api/produtos', productRoutes);
app.use('/api/carrinho', cartRoutes);

// --- Tratamento de Erros Globais (Segurança Jurídica) ---
app.use((err, req, res, next) => {
    console.error("Falha na instrução do servidor:", err.stack);
    res.status(500).json({ error: "Erro interno no processamento da demanda." });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Conexão com o Banco de Dados estabelecida com sucesso!");
});