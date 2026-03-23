import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ServicoModule } from './servico/servico.module';
import { PacienteModule } from './paciente/paciente.module';
import { AgendamentoModule } from './agendamento/agendamento.module';

@Module({
  imports: [PrismaModule, ServicoModule, PacienteModule, AgendamentoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
