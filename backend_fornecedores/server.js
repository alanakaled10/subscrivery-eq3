import express from 'express';
import cors from 'cors';
import usuarioRoutes from './src/routes/usuarioRoutes.js'; 
import fornecedorRoutes from './src/routes/fornecedorRoutes.js';

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(usuarioRoutes); 
app.use('/fornecedores', fornecedorRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

