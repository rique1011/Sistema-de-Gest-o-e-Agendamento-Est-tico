import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getResumoDoDia(dataConsulta: string) {
    const inicioDia = new Date(dataConsulta);
    inicioDia.setUTCHours(0, 0, 0, 0);
    const fimDia = new Date(dataConsulta);
    fimDia.setUTCHours(23, 59, 59, 999);

    // 1. Busca todos os agendamentos do dia trazendo o valor do serviço e nome do paciente
    const agendamentos = await this.prisma.agendamento.findMany({
      where: {
        data_inicio: { gte: inicioDia, lte: fimDia },
      },
      include: {
        servico: true,
        paciente: true,
      },
      orderBy: { data_inicio: 'asc' },
    });

    // 2. Calcula as métricas
    const total = agendamentos.length;
    const cancelados = agendamentos.filter(a => a.status === 'CANCELADO').length;
    const concluidos = agendamentos.filter(a => a.status === 'CONCLUIDO').length;
    const agendados = agendamentos.filter(a => a.status === 'AGENDADO' || a.status === 'CONFIRMADO').length;

    // 3. Calcula o Faturamento (Soma os valores apenas de quem não cancelou/faltou)
    const faturamentoPrevisto = agendamentos
      .filter(a => a.status !== 'CANCELADO' && a.status !== 'FALTOU')
      .reduce((acc, curr) => acc + Number(curr.servico.valor), 0);

    // 4. Filtra a lista dos próximos pacientes do dia
    const proximosPacientes = agendamentos
      .filter(a => a.status === 'AGENDADO' || a.status === 'CONFIRMADO')
      .map(a => ({
        id: a.id,
        hora: a.data_inicio.toISOString().substring(11, 16), // Pega só o "HH:MM"
        paciente: a.paciente.nome,
        servico: a.servico.nome,
        valor: Number(a.servico.valor),
      }));

    return {
      data: dataConsulta,
      metricas: {
        total_agendamentos: total,
        agendados_ativos: agendados,
        concluidos,
        cancelados,
        faturamento_previsto_reais: faturamentoPrevisto,
      },
      proximos_atendimentos: proximosPacientes,
    };
  }
}