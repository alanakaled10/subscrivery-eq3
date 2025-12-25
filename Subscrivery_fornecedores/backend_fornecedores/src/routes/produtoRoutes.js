import express from 'express';
const router = express.Router();
import * as produtoController from '../controllers/podutoController.js';

router.post('/cadastrar', produtoController.cadastrarProduto);
router.get('/meus-produtos', produtoController.listarProdutosFornecedor);
router.patch('/:id_produto/inativar', produtoController.inativarProduto);
router.put('/:id_produto/atualizar', produtoController.atualizarProduto);
router.patch('/:id_produto/reativar', produtoController.reativarProduto);

export default router;