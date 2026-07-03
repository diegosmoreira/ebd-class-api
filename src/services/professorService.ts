import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

interface CreateProfessorDto {
  email: string;
  nome: string;
  codigo: string;
  classesIds?: string[];
}

export class ProfessorService {
  static async create(data: CreateProfessorDto) {
    const defaultPassword = await bcrypt.hash('senha-padrao', 10);

    return prisma.$transaction(async (tx) => {
      // Create user first
      const usuario = await tx.usuario.create({
        data: {
          email: data.email,
          password_hash: defaultPassword,
          role: Role.PROFESSOR,
          must_change_password: true,
        },
      });

      // Create professor linked to user
      const professor = await tx.professor.create({
        data: {
          codigo: data.codigo,
          nome: data.nome,
          usuario_id: usuario.id,
          classes: data.classesIds ? {
            connect: data.classesIds.map(id => ({ id }))
          } : undefined,
        },
        include: {
          usuario: true,
          classes: true,
        },
      });

      return professor;
    });
  }

  static async findAll() {
    return prisma.professor.findMany({
      include: {
        classes: true,
      },
    });
  }

  static async findById(id: string) {
    return prisma.professor.findUnique({
      where: { id },
      include: {
        classes: true,
        usuario: true,
      },
    });
  }

  static async update(id: string, data: { nome?: string; codigo?: string; classesIds?: string[] }) {
    return prisma.professor.update({
      where: { id },
      data: {
        nome: data.nome,
        codigo: data.codigo,
        classes: data.classesIds ? {
          set: data.classesIds.map(cid => ({ id: cid }))
        } : undefined,
      },
      include: {
        classes: true,
      },
    });
  }

  static async inativar(id: string) {
    return prisma.$transaction(async (tx) => {
      // Get professor and user
      const professor = await tx.professor.findUnique({
        where: { id },
        include: { usuario: true },
      });

      if (!professor) {
        throw new Error('Professor não encontrado');
      }

      // Mark professor as inactive
      const updatedProfessor = await tx.professor.update({
        where: { id },
        data: { ativo: false },
      });

      // Remove from future classes (aulas)
      const now = new Date();
      await tx.aula.updateMany({
        where: {
          professor_id: id,
          data: { gt: now },
        },
        data: {
          professor_id: null,
        },
      });

      // In the real system, you might also want to disable the user login
      // Actually FR-021: "O acesso do professor ao sistema (login) MUST ser bloqueado."
      // Let's add an active flag or just let Auth layer check professor.ativo

      return updatedProfessor;
    });
  }
}
