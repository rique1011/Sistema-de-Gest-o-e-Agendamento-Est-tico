import { PartialType } from '@nestjs/swagger';
import { CreateBloqueioDto } from './create-bloqueio.dto';

export class UpdateBloqueioDto extends PartialType(CreateBloqueioDto) {}
