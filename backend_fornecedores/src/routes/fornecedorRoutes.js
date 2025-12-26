import express from 'express';
const router = express.Router();

import { getPerfilById, atualizarPerfil } from '../controllers/usuarioController.js';
import { listarTodosPedidos, atualizarStatusPedido } from '../controllers/pedidoController.js';

router.get('/pedidos', listarTodosPedidos);
router.put('/pedidos/status/:idPedido', atualizarStatusPedido);
router.get('/perfil/:id', getPerfilById);
router.put('/perfil/:id', atualizarPerfil);

export default router;

