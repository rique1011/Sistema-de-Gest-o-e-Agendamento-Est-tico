import { Test, TestingModule } from '@nestjs/testing';
import { ServicoController } from './servico.controller';
import { ServicoService } from './servico.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('ServicoController', () => {
  let controller: ServicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicoController],
      providers: [ServicoService, PrismaService, JwtService],
    }).compile();

    controller = module.get<ServicoController>(ServicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});