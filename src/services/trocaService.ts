import prisma from '../prisma/client';

export class TrocaService {
  static async solicitarTroca(data: { aula_id: string; professor_origem_id: string; professor_destino_id: string }) {
    // Validate aula belongs to professor_origem
    const aula = await prisma.aula.findUnique({ where: { id: data.aula_id } });
    if (!aula) throw new Error('Aula não encontrada');
    if (aula.professor_id !== data.professor_origem_id) {
      throw new Error('Professor de origem não é o responsável por esta aula');
    }

    return prisma.trocaDeAula.create({
      data: {
        aula_id: data.aula_id,
        professor_origem_id: data.professor_origem_id,
        professor_destino_id: data.professor_destino_id,
        status: 'PENDING'
      }
    });
  }

  static async aceitarOuRejeitar(trocaId: string, professorId: string, acao: 'ACEITAR' | 'REJEITAR') {
    const troca = await prisma.trocaDeAula.findUnique({ where: { id: trocaId } });
    if (!troca) throw new Error('Solicitação de troca não encontrada');
    if (troca.professor_destino_id !== professorId) {
      throw new Error('Apenas o professor destino pode aceitar ou rejeitar a troca');
    }
    if (troca.status !== 'PENDING') {
      throw new Error('A solicitação de troca não está pendente');
    }

    const novoStatus = acao === 'ACEITAR' ? 'ACCEPTED' : 'REJECTED';

    return prisma.trocaDeAula.update({
      where: { id: trocaId },
      data: { status: novoStatus, action_date: new Date() }
    });
  }

  static async aprovarOuReprovar(trocaId: string, adminId: string, acao: 'APROVAR' | 'REPROVAR') {
    const troca = await prisma.trocaDeAula.findUnique({ where: { id: trocaId } });
    if (!troca) throw new Error('Solicitação de troca não encontrada');
    if (troca.status !== 'ACCEPTED') {
      throw new Error('Apenas trocas aceitas pelo professor destino podem ser avaliadas pelo Admin');
    }

    return prisma.$transaction(async (tx) => {
      const novoStatus = acao === 'APROVAR' ? 'APPROVED' : 'DECLINED';

      const trocaAtualizada = await tx.trocaDeAula.update({
        where: { id: trocaId },
        data: {
          status: novoStatus,
          approved_by_id: adminId,
          action_date: new Date()
        }
      });

      if (novoStatus === 'APPROVED') {
        await tx.aula.update({
          where: { id: troca.aula_id },
          data: { professor_id: troca.professor_destino_id }
        });
      }

      return trocaAtualizada;
    });
  }

  static async findAll() {
    return prisma.trocaDeAula.findMany({
      include: {
        aula: { select: { titulo: true, data: true } },
        professor_origem: { select: { nome: true } },
        professor_destino: { select: { nome: true } },
      },
      orderBy: { created_at: 'desc' }
    });
  }
}
