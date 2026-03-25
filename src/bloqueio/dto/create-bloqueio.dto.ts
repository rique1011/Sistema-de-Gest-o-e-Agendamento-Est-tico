import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateBloqueioDto {
  @IsISO8601()
  data_inicio: string;

  @IsISO8601()
  data_fim: string;

  @IsOptional()
  @IsString()
  motivo?: string;
}