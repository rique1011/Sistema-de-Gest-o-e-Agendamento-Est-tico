import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    // 1. Verifica se já existe um agendamento que começa no mesmo horário
    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        data_inicio: createAgendamentoDto.data_inicio,
      },
    });

    if (conflito) {
      throw new ConflictException('Este horário de início já está ocupado.');
    }

    // 2. Cria usando os campos corretos do seu schema
    return this.prisma.agendamento.create({
      data: createAgendamentoDto,
    });
  }

  async findAll(dataFiltro?: string) {
    // Se houver filtro, buscamos pela data_inicio
    if (dataFiltro) {
      return this.prisma.agendamento.findMany({
        where: {
          data_inicio: {
            gte: new Date(`${dataFiltro}T00:00:00Z`), // Maior ou igual ao início do dia
            lte: new Date(`${dataFiltro}T23:59:59Z`), // Menor ou igual ao fim do dia
          },
        },
        include: { paciente: true, servico: true },
        orderBy: { data_inicio: 'asc' },
      });
    }

    return this.prisma.agendamento.findMany({
      include: { paciente: true, servico: true },
      orderBy: { data_inicio: 'asc' },
    });
  }

  async findOne(id: string) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      include: { paciente: true, servico: true },
    });
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
    return agendamento;
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto) {
    await this.findOne(id);
    return this.prisma.agendamento.update({
      where: { id },
      data: updateAgendamentoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.agendamento.delete({ where: { id } });
  }
}