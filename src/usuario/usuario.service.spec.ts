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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve lançar um ConflictException se o email já estiver cadastrado', async () => {
    const dto = { nome: 'Teste', email: 'duplicado@teste.com', senha: '123' };
    
    // Simulamos que o Prisma encontrou um usuário com esse email
    jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(dto as any);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('deve transformar a senha em hash antes de salvar no banco', async () => {
    const senhaPura = '123456';
    const dto = { nome: 'Admin', email: 'admin@teste.com', senha: senhaPura };
    let senhaCapturadaNoMock = '';

    // INTERCEPTADOR: Capturamos a senha exatamente como ela chega no Prisma
   jest.spyOn(prisma.usuario, 'create').mockImplementation(((args: any) => {
      senhaCapturadaNoMock = args.data.senha;
      
      return Promise.resolve({
        id: '1',
        ...args.data,
        criado_em: new Date(),
      });
    }) as any);

    await service.create(dto);

    // Validação real: a senha que foi para o banco não pode ser a senha pura
    expect(senhaCapturadaNoMock).not.toBe(senhaPura);
    
    // Verifica se é um hash Bcrypt (geralmente tem mais de 20 caracteres)
    // Isso evita o erro de 'undefined' que você teve antes
    expect(senhaCapturadaNoMock.length).toBeGreaterThan(20);
  });
});