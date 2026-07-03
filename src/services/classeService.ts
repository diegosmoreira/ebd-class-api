import prisma from '../prisma/client';

export class ClasseService {
  static async create(nome: string) {
    return prisma.classe.create({
      data: { nome },
    });
  }

  static async findAll(groupIds?: string[]) {
    return prisma.classe.findMany({
      where: groupIds ? { id: { in: groupIds } } : undefined,
      orderBy: { nome: 'asc' },
    });
  }

  static async findById(id: string) {
    return prisma.classe.findUnique({
      where: { id },
    });
  }

  static async update(id: string, nome: string) {
    return prisma.classe.update({
      where: { id },
      data: { nome },
    });
  }

  static async delete(id: string) {
    return prisma.classe.delete({
      where: { id },
    });
  }
}
