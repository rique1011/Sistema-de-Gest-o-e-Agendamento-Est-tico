import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário
import { CreateConfiguracaoAgendaDto } from './dto/create-configuracao-agenda.dto';

@Injectable()
export class ConfiguracaoAgendaService {
  constructor(private prisma: PrismaService) {}

  async salvar(createDto: CreateConfiguracaoAgendaDto) {
    const { horarios } = createDto;

    // Usamos um loop para salvar cada dia da semana
    const promessas = horarios.map((h) =>
      this.prisma.configuracaoAgenda.upsert({
        where: { dia_semana: h.dia_semana },
        update: {
          ativo: h.ativo,
          abertura: h.abertura,
          fechamento: h.fechamento,
          almoco_inicio: h.almoco_inicio,
          almoco_fim: h.almoco_fim,
        },
        create: {
          dia_semana: h.dia_semana,
          nome: h.nome,
          ativo: h.ativo,
          abertura: h.abertura,
          fechamento: h.fechamento,
          almoco_inicio: h.almoco_inicio,
          almoco_fim: h.almoco_fim,
        },
      }),
    );

    return Promise.all(promessas);
  }

  async buscarTodas() {
    return this.prisma.configuracaoAgenda.findMany({
      orderBy: { dia_semana: 'asc' },
    });
  }
}