import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';


@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    const inicio = new Date(createAgendamentoDto.data_inicio);
    const fim = new Date(createAgendamentoDto.data_fim);

    // 1. Verifica no banco se já existe algum agendamento que conflita com esse horário
    const horarioOcupado = await this.prisma.agendamento.findFirst({
      where: {
        // A mágica da sobreposição de datas do Prisma
        data_inicio: { lt: fim }, // 'lt' significa 'less than' (menor que)
        data_fim: { gt: inicio }, // 'gt' significa 'greater than' (maior que)
      },
    });

    // 2. Se achou um agendamento no mesmo horário, bloqueia a operação
    if (horarioOcupado) {
      throw new ConflictException('Já existe um agendamento para este horário.');
    }

    // 3. Se o caminho estiver livre, salva no banco!
    return this.prisma.agendamento.create({
      data: {
        data_inicio: inicio,
        data_fim: fim,
        pacienteId: createAgendamentoDto.pacienteId,
        servicoId: createAgendamentoDto.servicoId,
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