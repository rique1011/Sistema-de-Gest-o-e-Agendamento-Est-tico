import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ServicoModule } from './servico/servico.module';
import { PacienteModule } from './paciente/paciente.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { BloqueioModule } from './bloqueio/bloqueio.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LembreteModule } from './lembrete/lembrete.module';
import { ConfiguracaoAgendaModule } from './configuracao-agenda/configuracao-agenda.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    ScheduleModule.forRoot(), 
    PrismaModule, 
    ServicoModule, 
    PacienteModule, 
    AgendamentoModule, 
    UsuarioModule, 
    AuthModule, 
    BloqueioModule,
    DashboardModule, 
    LembreteModule, ConfiguracaoAgendaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}