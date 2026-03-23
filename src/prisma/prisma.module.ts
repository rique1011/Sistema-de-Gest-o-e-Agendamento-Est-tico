import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Isso permite que Paciente e Servico usem o Prisma
})
export class PrismaModule {}