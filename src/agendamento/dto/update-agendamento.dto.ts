import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDto } from './create-agendamento.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusAgendamento } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importe aqui

export class UpdateAgendamentoDto extends PartialType(CreateAgendamentoDto) {
  @ApiProperty({
    enum: StatusAgendamento,
    description: 'Novo status do agendamento',
    example: StatusAgendamento.CANCELADO,
  })
  @IsOptional()
  @IsEnum(StatusAgendamento, {
    message: 'Status inválido. Use: AGENDADO, CONFIRMADO, CANCELADO, CONCLUIDO ou FALTOU',
  })
  status?: StatusAgendamento;
}