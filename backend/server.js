import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes);

app.listen(3000, () => console.log("Servidor rodando e organizado! 🚀"));