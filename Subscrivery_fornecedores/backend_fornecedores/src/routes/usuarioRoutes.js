import express from 'express';
import { 
  cadastrarFornecedor, 
  loginFornecedor, 
  getPerfilById, 
  atualizarPerfil,
  alterarSenhaFornecedor 
} from '../controllers/usuarioController.js';
import { obterEstatisticas, listarEntregasRecentes } from '../controllers/dashboardController.js'; 

const router = express.Router();

router.post('/usuarios', cadastrarFornecedor);
router.post('/login', loginFornecedor);
router.get('/dashboard/stats', obterEstatisticas);
router.get('/dashboard/entregas', listarEntregasRecentes);
router.get('/fornecedores/perfil/:id', getPerfilById);
router.put('/fornecedores/perfil/:id', atualizarPerfil);
router.patch('/fornecedores/perfil/:id/alterar-senha', alterarSenhaFornecedor);

export default router;