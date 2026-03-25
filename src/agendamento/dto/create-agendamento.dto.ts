import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateAgendamentoDto {
  @ApiProperty({ example: '2026-03-24T14:00:00Z' })
  @IsISO8601()
  data_inicio: string;

  @ApiProperty({ example: '2026-03-24T15:00:00Z' })
  @IsISO8601()
  data_fim: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  servicoId: string;
}