/*
  Warnings:

  - The `status` column on the `Agendamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO', 'FALTOU');

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "status",
ADD COLUMN     "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO';

-- DropEnum
DROP TYPE "Status";
