import prisma from '../prisma/client';

export class LicaoService {
  static async create(data: { numero: number; titulo: string; trimestre_id: string; classe_id: string }) {
    return prisma.licao.create({
      data,
    });
  }

  static async findAll() {
    return prisma.licao.findMany({
      include: {
        trimestre: true,
        classe: true,
      },
    });
  }

  static async findById(id: string) {
    return prisma.licao.findUnique({
      where: { id },
      include: {
        trimestre: true,
        classe: true,
      },
    });
  }

  static async update(id: string, data: { numero?: number; titulo?: string; trimestre_id?: string; classe_id?: string }) {
    return prisma.licao.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.licao.delete({
      where: { id },
    });
  }
}
