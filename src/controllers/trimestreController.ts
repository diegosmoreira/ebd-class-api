import { Request, Response } from 'express';
import { TrimestreService } from '../services/trimestreService';
import { EscalaService } from '../services/escalaService';

export class TrimestreController {
  static async create(req: Request, res: Response) {
    try {
      const trimestre = await TrimestreService.create(req.body);
      return res.status(201).json(trimestre);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    const trimestres = await TrimestreService.findAll();
    return res.json(trimestres);
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const trimestre = await TrimestreService.findById(id);
    if (!trimestre) return res.status(404).json({ error: 'Trimestre não encontrado' });
    return res.json(trimestre);
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const trimestre = await TrimestreService.update(id, req.body);
      return res.json(trimestre);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await TrimestreService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async gerarAulas(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { classe_id } = req.body;
    
    try {
      const aulas = await TrimestreService.gerarAulas(id, classe_id);
      return res.status(201).json(aulas);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async gerarEscala(req: Request, res: Response) {
    const { id, classe_id } = req.params as { id: string; classe_id: string };
    
    try {
      const result = await EscalaService.gerarEscala(id, classe_id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
