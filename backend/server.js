import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import assinaturaRoutes from './src/routes/assinaturaRoutes.js';
import categoriaRoutes from './src/routes/categoriaRoutes.js';
import fornecedorRoutes from './src/routes/fornecedorRoutes.js';
import planoRoutes from './src/routes/planoRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/assinaturas', assinaturaRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/fornecedores', fornecedorRoutes);
app.use('/plans', planoRoutes);

app.listen(3000, () => console.log("Servidor rodando! 🚀"));