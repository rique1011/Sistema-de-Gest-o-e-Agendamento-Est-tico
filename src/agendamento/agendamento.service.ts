import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    // Transforma as strings que vieram do DTO em objetos Date do JavaScript
    const inicio = new Date(createAgendamentoDto.data_inicio);
    const fim = new Date(createAgendamentoDto.data_fim);

    // --- REGRA 0: Validação de Data Quebrada (Anti-Erro 500 do Prisma) ---
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException('Formato de data inválido. Use o padrão ISO 8601 (ex: 2026-04-15T14:00:00Z).');
    }

    // --- REGRA 1: Sanidade das datas ---
    if (inicio >= fim) {
      throw new BadRequestException('A data de início deve ser anterior à data de término.');
    }

    // --- REGRA 2: Dias de Funcionamento (Segunda a Sexta) ---
    const diaDaSemana = inicio.getDay(); // Retorna de 0 (Domingo) a 6 (Sábado)
    if (diaDaSemana === 0 || diaDaSemana === 6) {
      throw new BadRequestException('A clínica não funciona aos finais de semana.');
    }

    // --- REGRA 3: Horário Comercial (08:00 às 18:00) ---
    const horaInicio = inicio.getHours();
    const horaFim = fim.getHours();
    const minutoFim = fim.getMinutes();

    if (horaInicio < 8 || horaFim > 18 || (horaFim === 18 && minutoFim > 0)) {
      throw new BadRequestException('O horário de funcionamento é das 08:00 às 18:00.');
    }

    // --- REGRA 4: Conflito de Horários ---
    const horarioOcupado = await this.prisma.agendamento.findFirst({
      where: {
        data_inicio: { lt: fim },
        data_fim: { gt: inicio },
      },
    });

    if (horarioOcupado) {
      throw new ConflictException('Já existe um agendamento para este horário.');
    }

    // --- SUCESSO: Salva no Banco de Dados ---
    return this.prisma.agendamento.create({
      data: {
        data_inicio: inicio,
        data_fim: fim,
        pacienteId: createAgendamentoDto.pacienteId,
        servicoId: createAgendamentoDto.servicoId,
      },
    });
  }

  async findAll(data?: string) {
    // Se o frontend enviou uma data específica na URL
    if (data) {
      // Montamos o começo e o fim do dia
      const inicioDoDia = new Date(`${data}T00:00:00.000Z`);
      const fimDoDia = new Date(`${data}T23:59:59.999Z`);

      return this.prisma.agendamento.findMany({
        where: {
          data_inicio: {
            gte: inicioDoDia, // maior ou igual ao começo do dia
            lte: fimDoDia,    // menor ou igual ao fim do dia
          },
        },
        include: {
          paciente: true,
          servico: true,
        },
        orderBy: {
          data_inicio: 'asc', // Ordena do mais cedo pro mais tarde
        },
      });
    }

    // Se não enviou data nenhuma, traz todos os agendamentos
    return this.prisma.agendamento.findMany({
      include: {
        paciente: true,
        servico: true,
      },
      orderBy: {
        data_inicio: 'asc',
      },
    });
  }
  async findOne(id: string) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      include: { paciente: true, servico: true },
    });
    
    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    
    return agendamento;
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto) {
    // Verifica se o agendamento existe antes de atualizar
    await this.findOne(id);

    return this.prisma.agendamento.update({
      where: { id },
      data: updateAgendamentoDto,
    });
  }

  async remove(id: string) {
    // Verifica se o agendamento existe antes de deletar
    await this.findOne(id);

    return this.prisma.agendamento.delete({ 
      where: { id } 
    });
  }
}