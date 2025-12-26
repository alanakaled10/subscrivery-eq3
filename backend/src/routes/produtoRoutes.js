import express from 'express';
import { listarProdutos } from '../controllers/produtoController.js';

const router = express.Router();

router.get('/', listarProdutos);

export default router;