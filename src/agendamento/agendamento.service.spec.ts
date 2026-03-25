import { Test, TestingModule } from '@nestjs/testing';
import { AgendamentoService } from './agendamento.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('AgendamentoService', () => {
  let service: AgendamentoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendamentoService,
        {
          provide: PrismaService,
          useValue: {
            agendamento: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AgendamentoService>(AgendamentoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve lançar um ConflictException se o horário já estiver ocupado', async () => {
    const dto = {
      data_inicio: '2026-03-24T14:00:00Z',
      data_fim: '2026-03-24T15:00:00Z',
      pacienteId: '123',
      servicoId: '456',
    };

    // Simulamos que o Prisma ACHOU um agendamento existente
    jest.spyOn(prisma.agendamento, 'findFirst').mockResolvedValue(dto as any);

    // O teste espera que a função 'create' exploda com um ConflictException
    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('deve criar um agendamento com sucesso se o horário estiver livre', async () => {
    const dto = {
      data_inicio: '2026-03-24T16:00:00Z',
      data_fim: '2026-03-24T17:00:00Z',
      pacienteId: '123',
      servicoId: '456',
    };

    // Simulamos que o Prisma NÃO achou nada (horário vago)
    jest.spyOn(prisma.agendamento, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.agendamento, 'create').mockResolvedValue(dto as any);

    const resultado = await service.create(dto);
    expect(resultado).toEqual(dto);
  });

  it('deve lançar um BadRequestException se a data de fim for anterior à data de início', async () => {
  const dto = {
    data_inicio: '2026-03-24T15:00:00Z',
    data_fim: '2026-03-24T14:00:00Z', // Hora de fim ANTES da de início
    pacienteId: '123',
    servicoId: '456',
  };

  // O teste espera que o service barre essa loucura
  await expect(service.create(dto)).rejects.toThrow(BadRequestException);
});
}); 