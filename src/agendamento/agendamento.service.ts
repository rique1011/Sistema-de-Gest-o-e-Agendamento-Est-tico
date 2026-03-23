import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    return this.prisma.agendamento.create({
      data: {
        data_inicio: new Date(createAgendamentoDto.data_inicio),
        data_fim: new Date(createAgendamentoDto.data_fim),
        pacienteId: createAgendamentoDto.pacienteId,
        servicoId: createAgendamentoDto.servicoId,
        // status já tem o default 'AGENDADO' no schema.prisma
      },
    });
  }

  async findAll() {
    return this.prisma.agendamento.findMany({
      include: {
        paciente: true, // Traz os dados do paciente junto!
        servico: true,  // Traz os dados do serviço junto!
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.agendamento.findUnique({
      where: { id },
      include: { paciente: true, servico: true },
    });
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.prisma.agendamento.update({
      where: { id },
      data: updateAgendamentoDto,
    });
  }

  async remove(id: string) {
    return this.prisma.agendamento.delete({ where: { id } });
  }
}