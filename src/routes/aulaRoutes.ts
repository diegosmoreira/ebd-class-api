import { Router } from 'express';
import { AulaController } from '../controllers/aulaController';

const router = Router();

router.get('/', AulaController.findAllByClasse);

export default router;
