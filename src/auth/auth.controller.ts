import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'; // <-- Importamos as validações

class LoginDto {
  @ApiProperty({ example: 'admin@bioschedule.com' })
  @IsEmail({}, { message: 'O e-mail precisa ser válido' }) // <-- Crachá de E-mail
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SenhaForte123' })
  @IsString() // <-- Crachá de Texto
  @IsNotEmpty()
  senha: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // Agora o loginDto vai chegar intacto!
    return this.authService.login(loginDto.email, loginDto.senha);
  }
}