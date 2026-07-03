import { Router } from 'express';
import { LicaoController } from '../controllers/licaoController';

const router = Router();

router.post('/', LicaoController.create);
router.get('/', LicaoController.findAll);
router.get('/:id', LicaoController.findById);
router.put('/:id', LicaoController.update);
router.delete('/:id', LicaoController.delete);

export default router;
