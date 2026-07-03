import { Request, Response } from 'express';
import { TrocaService } from '../services/trocaService';

export class TrocaController {
  static async solicitarTroca(req: Request, res: Response) {
    try {
      const troca = await TrocaService.solicitarTroca(req.body);
      return res.status(201).json(troca);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async aceitarOuRejeitar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { acao, professor_id } = req.body;
      const troca = await TrocaService.aceitarOuRejeitar(id, professor_id, acao);
      return res.json(troca);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async aprovarOuReprovar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { acao, admin_id } = req.body;
      const troca = await TrocaService.aprovarOuReprovar(id, admin_id, acao);
      return res.json(troca);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const trocas = await TrocaService.findAll();
      return res.json(trocas);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
