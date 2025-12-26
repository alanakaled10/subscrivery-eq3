import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import assinaturaRoutes from './src/routes/assinaturaRoutes.js';
import categoriaRoutes from './src/routes/categoriaRoutes.js';
import fornecedorRoutes from './src/routes/fornecedorRoutes.js';
import planoRoutes from './src/routes/planoRoutes.js';
import produtoRoutes from './src/routes/produtoRoutes.js'; 
import cartaoRoutes from './src/routes/cartaoRoutes.js';
import enderecoRoutes from './src/routes/enderecoRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

// Definição dos Endpoints
app.use('/auth', authRoutes);
app.use('/assinaturas', assinaturaRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/fornecedores', fornecedorRoutes);
app.use('/plans', planoRoutes);
app.use('/produtos', produtoRoutes); 
app.use('/cartoes', cartaoRoutes);
app.use('/enderecos', enderecoRoutes);

app.listen(3000, () => console.log("Servidor rodando! 🚀"));