import { Router } from 'express';
import { ClasseController } from '../controllers/classeController';
import { requireRole } from '../middlewares/requireRole';
import { Role } from '@prisma/client';

const router = Router();

const adminOnly = requireRole([Role.SUPERINTENDENTE, Role.PASTOR]);

router.post('/', adminOnly, ClasseController.create);
router.get('/', ClasseController.findAll);
router.get('/:id', ClasseController.findById);
router.put('/:id', adminOnly, ClasseController.update);
router.delete('/:id', adminOnly, ClasseController.delete);

export default router;
