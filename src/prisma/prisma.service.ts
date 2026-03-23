import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// Força o carregamento do seu arquivo .env
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Cria a conexão usando o pacote nativo do Postgres
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Conecta essa conexão ao adaptador do Prisma
    const adapter = new PrismaPg(pool as any);

    // 3. Inicializa o Prisma do jeito novo (Versão 7+) passando o adapter
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}