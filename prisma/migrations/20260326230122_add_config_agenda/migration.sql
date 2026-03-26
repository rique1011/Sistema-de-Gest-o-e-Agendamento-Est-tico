-- CreateTable
CREATE TABLE "ConfiguracaoAgenda" (
    "id" SERIAL NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "abertura" TEXT NOT NULL,
    "fechamento" TEXT NOT NULL,
    "almoco_inicio" TEXT NOT NULL,
    "almoco_fim" TEXT NOT NULL,

    CONSTRAINT "ConfiguracaoAgenda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracaoAgenda_dia_semana_key" ON "ConfiguracaoAgenda"("dia_semana");
