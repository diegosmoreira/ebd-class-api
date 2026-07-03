import prisma from '../prisma/client';

export class EscalaService {
  static async gerarEscala(trimestreId: string, classeId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Check if classe and trimestre exist
      const trimestre = await tx.trimestre.findUnique({ where: { id: trimestreId } });
      const classe = await tx.classe.findUnique({
        where: { id: classeId },
        include: {
          professores: {
            where: { ativo: true },
            orderBy: { nome: 'asc' }
          }
        }
      });

      if (!trimestre) throw new Error('Trimestre não encontrado');
      if (!classe) throw new Error('Classe não encontrada');

      // 2. Find all aulas for this classe in this trimestre
      const licoes = await tx.licao.findMany({
        where: { trimestre_id: trimestreId, classe_id: classeId },
        select: { id: true }
      });

      const licaoIds = licoes.map(l => l.id);

      const aulas = await tx.aula.findMany({
        where: { licao_id: { in: licaoIds } },
        orderBy: { data: 'asc' }
      });

      if (aulas.length === 0) {
        throw new Error('Não há aulas geradas para esta classe neste trimestre');
      }

      const professores = classe.professores;
      const warnings: string[] = [];

      if (professores.length === 0) {
        warnings.push('Não há professores ativos associados a esta classe. A escala foi gerada vazia.');
        // Clear all professor_ids
        for (const aula of aulas) {
          await tx.aula.update({
            where: { id: aula.id },
            data: { professor_id: null }
          });
        }
      } else {
        // Round-robin distribution
        for (let i = 0; i < aulas.length; i++) {
          const aula = aulas[i];
          const professor = professores[i % professores.length];
          await tx.aula.update({
            where: { id: aula.id },
            data: { professor_id: professor.id }
          });
        }
      }

      // Fetch the updated aulas to return
      const aulasAtualizadas = await tx.aula.findMany({
        where: { licao_id: { in: licaoIds } },
        orderBy: { data: 'asc' },
        include: {
          professor: {
            select: { id: true, nome: true }
          }
        }
      });

      return {
        aulas: aulasAtualizadas,
        warnings
      };
    });
  }
}
