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
          // Criamos o Mock do Prisma para não precisar de banco de dados real nos testes unitários
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

  it('deve lançar um ConflictException se o e-mail já estiver cadastrado', async () => {
    const dto = { nome: 'Lucas', email: 'lucas@teste.com', senha: '123' };

    // Simula que o Prisma encontrou um usuário existente (conflito)
    jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(dto as any);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('deve transformar a senha em hash antes de salvar no banco', async () => {
    const senhaPura = '123456';
    const dto = { nome: 'Admin', email: 'admin@teste.com', senha: senhaPura };

    /**
     * SOLUÇÃO PARA O ERRO DA IMAGEM 5e38ab:
     * Usamos ': any' nos argumentos e ': any' no retorno para ignorar a complexidade do PrismaPromise
     */
    jest.spyOn(prisma.usuario, 'create').mockImplementation((args: any): any => {
      // Validamos se a senha que chegou no "banco" já está criptografada
      expect(args.data.senha).not.toBe(senhaPura);
      
      // Verifica se o hash segue o padrão do Bcrypt ($2b$...)
      expect(args.data.senha).toMatch(/^\$2[ayb]\$.{56}$/);

      return Promise.resolve({
        id: 'uuid-gerado-pelo-mock',
        ...args.data,
        criado_em: new Date(),
      }) as any;
    });

    /**
     * SOLUÇÃO PARA O ERRO DA IMAGEM 5e3fc8:
     * Usamos 'as any' no resultado da chamada para que o TS nos deixe ler a propriedade .senha
     */
    const resultado = await service.create(dto) as any;

    expect(resultado).toHaveProperty('id');
    expect(resultado.senha).not.toBe(senhaPura);
    expect(resultado.senha.length).toBeGreaterThan(20);
  });
});