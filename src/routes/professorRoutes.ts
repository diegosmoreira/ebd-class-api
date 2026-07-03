import { Router } from 'express';
import { ProfessorController } from '../controllers/professorController';

const router = Router();

router.post('/', ProfessorController.create);
router.get('/', ProfessorController.findAll);
router.get('/:id', ProfessorController.findById);
router.put('/:id', ProfessorController.update);
router.post('/:id/inativar', ProfessorController.inativar);

export default router;
