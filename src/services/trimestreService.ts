import prisma from '../prisma/client';
import { get13Sundays } from '../utils/dateUtils';

export class TrimestreService {
  static async create(data: { numero: number; titulo: string; ano: number; data_inicial: Date; data_final: Date; meses: number[] }) {
    const start = new Date(data.data_inicial);
    const end = new Date(data.data_final);
    
    // Validate 13 domingos
    get13Sundays(start, end); // Throws if invalid

    return prisma.trimestre.create({
      data: {
        numero: data.numero,
        titulo: data.titulo,
        ano: data.ano,
        data_inicial: start,
        data_final: end,
        meses: data.meses,
      },
    });
  }

  static async gerarAulas(trimestreId: string, classeId: string) {
    return prisma.$transaction(async (tx) => {
      const trimestre = await tx.trimestre.findUnique({
        where: { id: trimestreId },
        include: { licoes: { where: { classe_id: classeId }, orderBy: { numero: 'asc' } } }
      });

      if (!trimestre) throw new Error('Trimestre não encontrado');
      if (trimestre.licoes.length !== 13) throw new Error('A classe não possui exatamente 13 lições no trimestre');

      const domingos = get13Sundays(new Date(trimestre.data_inicial), new Date(trimestre.data_final));

      const aulas = [];
      for (let i = 0; i < 13; i++) {
        const licao = trimestre.licoes[i];
        const dataAula = domingos[i];

        const aula = await tx.aula.create({
          data: {
            numero: licao.numero,
            titulo: licao.titulo,
            data: dataAula,
            licao_id: licao.id,
          }
        });
        aulas.push(aula);
      }

      return aulas;
    });
  }

  static async findAll() {
    return prisma.trimestre.findMany({
      orderBy: [{ ano: 'desc' }, { numero: 'desc' }]
    });
  }

  static async findById(id: string) {
    return prisma.trimestre.findUnique({
      where: { id },
      include: { licoes: true }
    });
  }

  static async update(id: string, data: any) {
    return prisma.trimestre.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    // Check for generated aulas
    const licoes = await prisma.licao.findMany({
      where: { trimestre_id: id },
      include: { aulas: true }
    });

    const hasAulas = licoes.some(l => l.aulas.length > 0);
    if (hasAulas) {
      throw new Error('Não é possível excluir um trimestre que já possui aulas geradas.');
    }

    return prisma.trimestre.delete({
      where: { id },
    });
  }
}
