import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExiste = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (usuarioExiste) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha, 10);

    const novoUsuario = await this.prisma.usuario.create({
      data: {
        nome: createUsuarioDto.nome,
        email: createUsuarioDto.email,
        senha: senhaCriptografada,
      },
    });

    // O jeito ninja (Desestruturação): tira a senha, guarda o resto em "usuarioSemSenha"
    const { senha, ...usuarioSemSenha } = novoUsuario;
    
    return usuarioSemSenha;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }
}