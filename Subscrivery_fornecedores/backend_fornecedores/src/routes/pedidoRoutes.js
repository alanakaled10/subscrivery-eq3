import express from 'express';
const router = express.Router();
import * as pedidoController from '../controllers/pedidoController.js';

router.get('/todos-pedidos', pedidoController.listarTodosPedidos);
router.get('/:idPedido/itens', pedidoController.listarItensDoPedido);
router.patch('/:idPedido/status-entrega', pedidoController.atualizarStatusEntrega);
router.delete('/:idPedido', pedidoController.excluirEntrega);

export default router;