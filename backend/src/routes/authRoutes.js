import express from 'express';
import { cadastro, login, esqueciSenha, redefinirSenha } from '../controllers/authController.js';

const router = express.Router();

router.post('/cadastro', cadastro);
router.post('/login', login);
router.post('/esqueci-senha', esqueciSenha);
router.post('/redefinir-senha', redefinirSenha);

export default router;