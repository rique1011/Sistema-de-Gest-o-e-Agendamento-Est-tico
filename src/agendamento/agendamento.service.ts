import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  // Função auxiliar para validar regras de ouro (Expediente/Almoço/Conflito)
  private async validarRegrasAgenda(data_inicio: string, data_fim: string, ignorarId?: string) {
    const inicio = new Date(data_inicio);
    const diaSemana = inicio.getDay();
    const horaMinutoInicio = inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

    const config = await this.prisma.configuracaoAgenda.findUnique({ where: { dia_semana: diaSemana } });
    if (!config || !config.ativo) throw new BadRequestException('Clínica fechada neste dia.');

    if (horaMinutoInicio < config.abertura || horaMinutoInicio >= config.fechamento) {
      throw new BadRequestException(`Fora do expediente (${config.abertura} - ${config.fechamento}).`);
    }

    if (horaMinutoInicio >= config.almoco_inicio && horaMinutoInicio < config.almoco_fim) {
      throw new BadRequestException('Horário de almoço/pausa.');
    }

    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        id: { not: ignorarId }, // Ignora o próprio agendamento ao editar
        OR: [{ data_inicio: { lt: new Date(data_fim) }, data_fim: { gt: new Date(data_inicio) } }]
      }
    });
    if (conflito) throw new BadRequestException('Já existe um agendamento neste horário.');
  }

  async create(dto: any) {
    await this.validarRegrasAgenda(dto.data_inicio, dto.data_fim);
    return this.prisma.agendamento.create({
      data: { ...dto, data_inicio: new Date(dto.data_inicio), data_fim: new Date(dto.data_fim) },
      include: { paciente: true, servico: true }
    });
  }

  async findAll() {
    return this.prisma.agendamento.findMany({ include: { paciente: true, servico: true }, orderBy: { data_inicio: 'asc' } });
  }

  async findOne(id: string) {
    const agendamento = await this.prisma.agendamento.findUnique({ where: { id }, include: { paciente: true, servico: true } });
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
    return agendamento;
  }

  async update(id: string, dto: any) {
    const agendamento = await this.findOne(id);
    
    // Se estiver mudando a data, valida as regras de novo
    if (dto.data_inicio && dto.data_fim) {
      await this.validarRegrasAgenda(dto.data_inicio, dto.data_fim, id);
    }

    return this.prisma.agendamento.update({
      where: { id },
      data: {
        ...dto,
        data_inicio: dto.data_inicio ? new Date(dto.data_inicio) : agendamento.data_inicio,
        data_fim: dto.data_fim ? new Date(dto.data_fim) : agendamento.data_fim,
      },
      include: { paciente: true, servico: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.agendamento.delete({ where: { id } });
  }
}