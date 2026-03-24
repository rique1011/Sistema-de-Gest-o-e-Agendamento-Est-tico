import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService
  ) {}

  async login(email: string, senhaPlana: string) {
    // 1. Busca o usuário pelo e-mail
    const usuario = await this.usuarioService.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 2. Compara a senha que veio do Swagger com a senha do Banco
    const senhaValida = await bcrypt.compare(senhaPlana, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 3. Se tudo estiver correto, monta o "Crachá" (Token JWT)
    const payload = { sub: usuario.id, email: usuario.email, nome: usuario.nome };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}