import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PacienteService', () => {
  let service: PacienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PacienteService, PrismaService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});