import { Module } from '@nestjs/common';
import { LembreteService } from './lembrete.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LembreteService]
})
export class LembreteModule {}
