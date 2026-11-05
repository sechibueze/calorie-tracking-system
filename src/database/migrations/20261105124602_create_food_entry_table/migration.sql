-- CreateTable
CREATE TABLE "food_entries" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "consumedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "food_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "food_entries_userId_consumedAt_idx" ON "food_entries"("userId", "consumedAt");

-- CreateIndex
CREATE INDEX "food_entries_createdAt_idx" ON "food_entries"("createdAt");

-- AddForeignKey
ALTER TABLE "food_entries" ADD CONSTRAINT "food_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
