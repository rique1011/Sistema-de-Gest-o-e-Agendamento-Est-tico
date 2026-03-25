import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBloqueioDto } from './dto/create-bloqueio.dto';
import { UpdateBloqueioDto } from './dto/update-bloqueio.dto';

@Injectable()
export class BloqueioService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBloqueioDto) {
    return this.prisma.bloqueio.create({ data: dto });
  }

  async findAll() {
    return this.prisma.bloqueio.findMany({
      orderBy: { data_inicio: 'asc' },
    });
  }

  async findOne(id: string) {
    const bloqueio = await this.prisma.bloqueio.findUnique({
      where: { id },
    });

    if (!bloqueio) {
      throw new NotFoundException('Bloqueio não encontrado.');
    }

    return bloqueio;
  }

  async update(id: string, dto: UpdateBloqueioDto) {
    // Reutiliza a função acima para garantir que o bloqueio existe
    await this.findOne(id); 

    return this.prisma.bloqueio.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    // Reutiliza a função acima para garantir que o bloqueio existe
    await this.findOne(id);

    return this.prisma.bloqueio.delete({
      where: { id },
    });
  }
}