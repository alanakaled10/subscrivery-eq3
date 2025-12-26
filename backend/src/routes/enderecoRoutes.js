import express from 'express';
import { salvarEndereco, listarEnderecos } from '../controllers/enderecoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verificarToken, salvarEndereco);
router.get('/', verificarToken, listarEnderecos);

export default router;