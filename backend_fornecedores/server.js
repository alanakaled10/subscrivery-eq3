import express from 'express';
import cors from 'cors';
import usuarioRoutes from './src/routes/usuarioRoutes.js'; 
import fornecedorRoutes from './src/routes/fornecedorRoutes.js';
import pedidoRoutes from './src/routes/pedidoRoutes.js'; 
import produtoRoutes from './src/routes/produtoRoutes.js';
import relatorioRoutes from './src/routes/relatorioRoutes.js';
const app = express();

app.use(cors()); 
app.use(express.json());
app.use(usuarioRoutes); 
app.use('/fornecedores', fornecedorRoutes);
app.use('/fornecedores/pedidos', pedidoRoutes); 
app.use('/fornecedores/produtos', produtoRoutes);
app.use('/fornecedores/relatorios', relatorioRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001 ");
});