const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:idUsuario', cartController.getItensCarrinho);
router.post('/add', cartController.adicionarAoCarrinho);
router.delete('/:idUsuario/:idProduto', cartController.removerDoCarrinho);
router.put('/update-quantity', cartController.atualizarQuantidade);
router.post('/finalizar', cartController.finalizarCompra);


module.exports = router;