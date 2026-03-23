import { Module } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Não esqueça disso!
  controllers: [AgendamentoController],
  providers: [AgendamentoService],
})
export class AgendamentoModule {}