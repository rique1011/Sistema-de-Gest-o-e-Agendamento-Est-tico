import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicoService {
  // Injetando o PrismaService que gerencia a conexão com o Postgres no Docker
  constructor(private prisma: PrismaService) {}

  // RF02 - Cadastro de novos serviços
  async create(createServicoDto: CreateServicoDto) {
    return this.prisma.servico.create({
      data: {
        nome: createServicoDto.nome,
        duracao_minutos: createServicoDto.duracao_minutos,
        valor: createServicoDto.valor,
      },
    });
  }

  // Listagem de todos os serviços (útil para o dashboard do Membro B)
  async findAll() {
    return this.prisma.servico.findMany();
  }

  // Busca um serviço específico por ID (UUID)
  async findOne(id: string) {
    const servico = await this.prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    return servico;
  }

  // Atualização de dados do serviço
  async update(id: string, updateServicoDto: UpdateServicoDto) {
    return this.prisma.servico.update({
      where: { id },
      data: updateServicoDto,
    });
  }

  // Remoção de serviço do catálogo
  async remove(id: string) {
    return this.prisma.servico.delete({
      where: { id },
    });
  }
}