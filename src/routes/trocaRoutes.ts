import { Router } from 'express';
import { TrocaController } from '../controllers/trocaController';

const router = Router();

router.post('/', TrocaController.solicitarTroca);
router.post('/:id/responder', TrocaController.aceitarOuRejeitar);
router.post('/:id/avaliar', TrocaController.aprovarOuReprovar);
router.get('/', TrocaController.findAll);

export default router;
