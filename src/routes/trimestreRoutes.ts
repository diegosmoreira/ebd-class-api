import { Router } from 'express';
import { TrimestreController } from '../controllers/trimestreController';

const router = Router();

router.post('/', TrimestreController.create);
router.get('/', TrimestreController.findAll);
router.get('/:id', TrimestreController.findById);
router.put('/:id', TrimestreController.update);
router.delete('/:id', TrimestreController.delete);
router.post('/:id/gerar-aulas', TrimestreController.gerarAulas);
router.post('/:id/gerar-escala/:classe_id', TrimestreController.gerarEscala);

export default router;
