import { Request, Response } from 'express';
import prisma from '../prisma/client';

export class AulaController {
  static async findAllByClasse(req: Request, res: Response) {
    try {
      const { classe_id, trimestre_id } = req.query as { classe_id?: string; trimestre_id?: string };
      
      const filter: any = {};
      
      if (classe_id || trimestre_id) {
        filter.licao = {};
        if (classe_id) filter.licao.classe_id = classe_id;
        if (trimestre_id) filter.licao.trimestre_id = trimestre_id;
      }

      const aulas = await prisma.aula.findMany({
        where: filter,
        include: {
          professor: {
            select: { id: true, nome: true }
          },
          licao: {
            select: { numero: true, titulo: true, classe_id: true, trimestre_id: true }
          }
        },
        orderBy: { data: 'asc' }
      });
      return res.json(aulas);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
