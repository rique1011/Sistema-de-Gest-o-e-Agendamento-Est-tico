import { IsBoolean, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DiaConfigDto {
  @IsNumber()
  dia_semana: number;

  @IsString()
  nome: string;

  @IsBoolean()
  ativo: boolean;

  @IsString()
  abertura: string;

  @IsString()
  fechamento: string;

  @IsString()
  almoco_inicio: string;

  @IsString()
  almoco_fim: string;
}

export class CreateConfiguracaoAgendaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiaConfigDto)
  horarios: DiaConfigDto[];
}