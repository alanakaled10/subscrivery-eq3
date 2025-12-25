import express from 'express';
import { listarCategorias } from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/', listarCategorias);

export default router;