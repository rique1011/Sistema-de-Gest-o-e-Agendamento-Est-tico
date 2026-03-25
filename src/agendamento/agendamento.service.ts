import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { Bloqueio, Agendamento } from '@prisma/client';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

 async create(createAgendamentoDto: CreateAgendamentoDto) {
  const inicio = new Date(createAgendamentoDto.data_inicio);
  const fim = new Date(createAgendamentoDto.data_fim);

  // 1. Validação de horário retroativo (já temos)
  if (fim <= inicio) {
    throw new BadRequestException('Horário inválido.');
  }

  // 2. NOVA VALIDAÇÃO: Verificar se o horário está BLOQUEADO pelo profissional
  const bloqueioExistente = await this.prisma.bloqueio.findFirst({
    where: {
      OR: [
        {
          data_inicio: { lte: inicio },
          data_fim: { gte: inicio },
        },
        {
          data_inicio: { lte: fim },
          data_fim: { gte: fim },
        },
      ],
    },
  });

  if (bloqueioExistente) {
    throw new ConflictException('Este horário foi bloqueado pelo profissional.');
  }
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
  async getDisponibilidade(dataQuery: string) {
  // 1. Definir horário de trabalho (Ex: 08:00 às 18:00)
  const slotsTrabalho = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // 2. Buscar Agendamentos e Bloqueios do dia selecionado
  const inicioDia = new Date(dataQuery);
  inicioDia.setUTCHours(0, 0, 0, 0);
  
  const fimDia = new Date(dataQuery);
  fimDia.setUTCHours(23, 59, 59, 999);

  const [agendamentos, bloqueios] = await Promise.all([
    this.prisma.agendamento.findMany({
      where: { data_inicio: { gte: inicioDia, lte: fimDia } }
    }),
    this.prisma.bloqueio.findMany({
      where: { data_inicio: { gte: inicioDia, lte: fimDia } }
    })
  ]);

  // 3. Cruzar os dados para ver o que está livre
  return slotsTrabalho.map(hora => {
    const horarioFull = `${dataQuery}T${hora}:00.000Z`;
    
    // Verifica se esse horário já está ocupado por paciente
    const ocupado = agendamentos.some(a => a.data_inicio.toISOString().includes(hora));
    
    // Verifica se esse horário está bloqueado pelo profissional
    const bloqueado = bloqueios.some(b => b.data_inicio.toISOString().includes(hora));

    return {
      hora,
      disponivel: !ocupado && !bloqueado,
      tipo: bloqueado ? 'BLOQUEADO' : ocupado ? 'AGENDADO' : 'LIVRE'
    };
  });
}
async alterarStatus(id: string, updateDto: UpdateAgendamentoDto) {
    // 1. Verifica se o agendamento existe antes de tentar atualizar
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    // 2. Atualiza o status no banco de dados
    return this.prisma.agendamento.update({
      where: { id },
      data: {
        status: updateDto.status,
      },
    });
  }
}

