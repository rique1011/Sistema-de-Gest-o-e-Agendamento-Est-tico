import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServicoDto {
  @ApiProperty({ example: 'Limpeza de Pele' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  nome: string;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(1, { message: 'A duração deve ser de pelo menos 1 minuto' })
  duracao_minutos: number;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0, { message: 'O valor não pode ser negativo' })
  valor: number;
}