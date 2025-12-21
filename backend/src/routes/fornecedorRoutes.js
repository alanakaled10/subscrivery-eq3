import express from 'express';
import { buscarFornecedores } from '../controllers/fornecedorController.js';

const router = express.Router();

router.get('/buscar', buscarFornecedores);

export default router;