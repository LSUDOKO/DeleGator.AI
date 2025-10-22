-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "deployTxHash" TEXT,
ADD COLUMN     "isDeployed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "strategyLogic" JSONB,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0';

-- CreateIndex
CREATE INDEX "strategies_isDeployed_idx" ON "strategies"("isDeployed");
