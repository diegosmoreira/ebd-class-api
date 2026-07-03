import { Router } from 'express';
import { RelatorioController } from '../controllers/relatorioController';

const router = Router();

router.get('/escala/pdf', RelatorioController.exportarEscalaPDF);
router.get('/escala/excel', RelatorioController.exportarEscalaExcel);

export default router;
