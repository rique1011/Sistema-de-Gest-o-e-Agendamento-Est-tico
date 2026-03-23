import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importe isso!

@Module({
  imports: [PrismaModule], // Adicione isso aqui!
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}