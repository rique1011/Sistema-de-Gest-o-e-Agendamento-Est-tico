import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve lançar erro se tentar cadastrar e-mail já existente', async () => {
    const dto = { nome: 'Lucas', email: 'duplicado@teste.com', senha: '123' };

    // Simula que o e-mail JÁ EXISTE no banco
    jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(dto as any);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });
});