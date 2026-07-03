import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';

export class ProfessorController {
  static async create(req: Request, res: Response) {
    const { email, nome, codigo, classesIds } = req.body;
    
    if (!email || !nome || !codigo) {
      return res.status(400).json({ error: 'Email, nome e código são obrigatórios' });
    }

    try {
      const professor = await ProfessorService.create({ email, nome, codigo, classesIds });
      return res.status(201).json(professor);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    const professores = await ProfessorService.findAll();
    return res.json(professores);
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const professor = await ProfessorService.findById(id);
    
    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    
    return res.json(professor);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { nome, codigo, classesIds } = req.body;

    try {
      const professor = await ProfessorService.update(id, { nome, codigo, classesIds });
      return res.json(professor);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async inativar(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    
    try {
      const professor = await ProfessorService.inativar(id);
      return res.json(professor);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
