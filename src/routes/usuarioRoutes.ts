import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

const router = Router();

router.post('/', UsuarioController.create);

export default router;
