const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const notificacoesController = require('../controllers/notificacoesController');
const carteiraController = require('../controllers/carteiraController');

// --- Rotas de Autenticação e Perfil ---
router.post('/login', authController.login);
router.post('/cadastro', authController.registrarUsuario);
router.get('/perfil/:id', authController.getPerfil);
router.put('/atualizar-dados', authController.atualizarDados);

// --- Rotas de Planos e Assinaturas ---
router.get('/produtos', authController.listarProdutos);
router.get('/categorias', authController.listarCategorias);
router.post('/assinar-plano', authController.criarAssinatura);
router.put('/migrar-plano', authController.assinarOuMudarPlano);
router.post('/processar-pagamento', authController.processarPagamentoSimulado);

// --- Rotas de Notificações (Ajustada para o Header) ---
router.get('/notificacoes/:idUsuario', notificacoesController.getNotificacoes);

// --- Rotas da Carteira (Dinâmicas para Saldo e Frete) ---

// Busca saldo atualizado (Limite do Plano - Gastos Reais)
router.get('/carteira/status/:idUsuario', carteiraController.getStatusCarteira);

// Busca histórico de débitos para prestação de contas
router.get('/carteira/historico/:idUsuario', carteiraController.getHistoricoCarteira);
router.get('/pedidos/:idUsuario', carteiraController.getMeusPedidos);



module.exports = router;