-- CreateTable
CREATE TABLE "broker_memory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "notablePreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interactionHistory" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "broker_memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "broker_memory_userId_key" ON "broker_memory"("userId");

-- CreateIndex
CREATE INDEX "broker_memory_userId_idx" ON "broker_memory"("userId");

-- AddForeignKey
ALTER TABLE "broker_memory" ADD CONSTRAINT "broker_memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
