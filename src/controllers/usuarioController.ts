import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';

export class UsuarioController {
  static async create(req: Request, res: Response) {
    try {
      const { email, role } = req.body;
      if (!role || (role !== 'SUPERINTENDENTE' && role !== 'PASTOR')) {
        return res.status(400).json({ error: 'O campo role é obrigatório e deve ser SUPERINTENDENTE ou PASTOR.' });
      }

      const usuario = await UsuarioService.create({ email, role });
      return res.status(201).json(usuario);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
