import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
  static async login(email: string, password_provided: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const valid = await bcrypt.compare(password_provided, user.password_hash);
    if (!valid) {
      throw new Error('Credenciais inválidas');
    }

    // Determine se o usuário precisa trocar de senha
    // Em produção, mesmo quem precisa trocar de senha recebe um token,
    // mas com uma flag restrict=true
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        mustChangePassword: user.must_change_password 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role, must_change_password: user.must_change_password } };
  }

  static async changePassword(userId: string, oldPassword_provided: string, newPassword_provided: string) {
    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const valid = await bcrypt.compare(oldPassword_provided, user.password_hash);
    if (!valid) throw new Error('Senha atual incorreta');

    const newHash = await bcrypt.hash(newPassword_provided, 10);

    return prisma.usuario.update({
      where: { id: userId },
      data: {
        password_hash: newHash,
        must_change_password: false,
      }
    });
  }

  static async adminResetPassword(adminId: string, targetUserId: string) {
    // A autorização deve garantir que o adminId é realmente um admin (role = PASTOR | SUPERINTENDENTE)
    const admin = await prisma.usuario.findUnique({ where: { id: adminId } });
    if (!admin || (admin.role !== 'PASTOR' && admin.role !== 'SUPERINTENDENTE')) {
      throw new Error('Acesso negado');
    }

    const defaultHash = await bcrypt.hash('senha-padrao', 10);

    return prisma.usuario.update({
      where: { id: targetUserId },
      data: {
        password_hash: defaultHash,
        must_change_password: true,
      }
    });
  }
}
