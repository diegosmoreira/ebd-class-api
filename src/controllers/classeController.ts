import { Request, Response } from 'express';
import { ClasseService } from '../services/classeService';
import prisma from '../prisma/client';

export class ClasseController {
  static async create(req: Request, res: Response) {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome da classe é obrigatório' });
    }
    const classe = await ClasseService.create(nome);
    return res.status(201).json(classe);
  }

  static async findAll(req: Request, res: Response) {
    const user = (req as any).user;
    let groupIds: string[] | undefined;

    if (user.role === 'PROFESSOR') {
      const professor = await prisma.professor.findFirst({
        where: { usuario_id: user.userId },
        include: { classes: true }
      });

      if (!professor || professor.classes.length === 0) {
        return res.json([]);
      }
      groupIds = professor.classes.map(c => c.id);
    }

    const classes = await ClasseService.findAll(groupIds);
    return res.json(classes);
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const classe = await ClasseService.findById(id);
    if (!classe) {
      return res.status(404).json({ error: 'Classe não encontrada' });
    }
    return res.json(classe);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome da classe é obrigatório' });
    }
    try {
      const classe = await ClasseService.update(id, nome);
      return res.json(classe);
    } catch (error) {
      return res.status(404).json({ error: 'Classe não encontrada' });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    try {
      await ClasseService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: 'Classe não encontrada ou não pode ser removida' });
    }
  }
}
