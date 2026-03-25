import { Test, TestingModule } from '@nestjs/testing';
import { AgendamentoController } from './agendamento.controller';
import { AgendamentoService } from './agendamento.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AgendamentoController', () => {
  let controller: AgendamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendamentoController],
      providers: [
        AgendamentoService,
        PrismaService,
        JwtService, // Necessário por causa do AuthGuard no Controller
      ],
    }).compile();

    controller = module.get<AgendamentoController>(AgendamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});