import express from 'express';
const router = express.Router();

import { getPerfilById, atualizarPerfil } from '../controllers/usuarioController.js';


router.get('/perfil/:id', getPerfilById);
router.put('/perfil/:id', atualizarPerfil);

export default router;