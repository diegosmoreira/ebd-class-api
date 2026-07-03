import { Request, Response } from 'express';
import { LicaoService } from '../services/licaoService';

export class LicaoController {
  static async create(req: Request, res: Response) {
    const { numero, titulo, trimestre_id, classe_id } = req.body;
    
    if (!numero || !titulo || !trimestre_id || !classe_id) {
      return res.status(400).json({ error: 'Número, título, trimestre e classe são obrigatórios' });
    }

    try {
      const licao = await LicaoService.create({ numero, titulo, trimestre_id, classe_id });
      return res.status(201).json(licao);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    const licoes = await LicaoService.findAll();
    return res.json(licoes);
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const licao = await LicaoService.findById(id);
    
    if (!licao) {
      return res.status(404).json({ error: 'Lição não encontrada' });
    }
    
    return res.json(licao);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { numero, titulo, trimestre_id, classe_id } = req.body;

    try {
      const licao = await LicaoService.update(id, { numero, titulo, trimestre_id, classe_id });
      return res.json(licao);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    
    try {
      await LicaoService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: 'Lição não pode ser removida' });
    }
  }
}
