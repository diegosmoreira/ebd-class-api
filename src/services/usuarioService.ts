import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export class UsuarioService {
  static async create(data: { email: string; role: Role }) {
    if (data.role !== 'SUPERINTENDENTE' && data.role !== 'PASTOR') {
      throw new Error('Role inválido para este endpoint. Apenas SUPERINTENDENTE e PASTOR são permitidos.');
    }

    const defaultPassword = await bcrypt.hash('senha-padrao', 10);

    return prisma.usuario.create({
      data: {
        email: data.email,
        password_hash: defaultPassword,
        role: data.role,
        must_change_password: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      }
    });
  }
}
