import express from 'express';
import { cadastrarFornecedor, loginFornecedor } from '../controllers/usuarioController.js';
import { obterEstatisticas, listarEntregasRecentes } from '../controllers/dashboardController.js'; 

const router = express.Router();

router.post('/usuarios', cadastrarFornecedor);
router.post('/login', loginFornecedor);
router.get('/dashboard/stats', obterEstatisticas);
router.get('/dashboard/entregas', listarEntregasRecentes);

export default router;