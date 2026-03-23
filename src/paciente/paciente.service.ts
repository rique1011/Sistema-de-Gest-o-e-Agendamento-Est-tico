import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    return this.prisma.paciente.create({
      data: createPacienteDto,
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany();
  }

  async findOne(id: string) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    return this.prisma.paciente.update({
      where: { id },
      data: updatePacienteDto,
    });
  }

  async remove(id: string) {
    return this.prisma.paciente.delete({ where: { id } });
  }
}