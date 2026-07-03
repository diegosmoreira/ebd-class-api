import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { rolesMiddleware } from '../middlewares/roles';

const router = Router();

router.post('/login', AuthController.login);
router.post('/change-password', authMiddleware, AuthController.changePassword);

router.post('/reset-password/:user_id', 
  authMiddleware, 
  rolesMiddleware(['PASTOR', 'SUPERINTENDENTE']), 
  AuthController.adminResetPassword
);

export default router;
