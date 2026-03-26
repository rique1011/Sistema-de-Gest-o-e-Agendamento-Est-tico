import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePacienteDto) {
    return this.prisma.paciente.create({ data });
  }

  findAll() {
    return this.prisma.paciente.findMany({ orderBy: { nome: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.paciente.findUnique({ where: { id } });
  }

  update(id: string, data: UpdatePacienteDto) {
    return this.prisma.paciente.update({ where: { id }, data });
  }

  async remove(id: string) {
    // 1. Remove agendamentos vinculados para evitar erro de integridade
    await this.prisma.agendamento.deleteMany({
      where: { pacienteId: id }
    });

    // 2. Remove o paciente
    return this.prisma.paciente.delete({ where: { id } });
  }
}