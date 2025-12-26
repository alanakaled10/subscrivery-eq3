import express from 'express';
const router = express.Router();
import * as relatorioController from '../controllers/relatorioController.js';

router.get('/consolidado', relatorioController.obterDadosRelatorio);

export default router;