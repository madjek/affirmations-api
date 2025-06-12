-- DropForeignKey
ALTER TABLE "Affirmation" DROP CONSTRAINT "Affirmation_createdById_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "Affirmation" ALTER COLUMN "createdById" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SavedAffirmation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "affirmationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedAffirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedAffirmation_userId_affirmationId_key" ON "SavedAffirmation"("userId", "affirmationId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affirmation" ADD CONSTRAINT "Affirmation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedAffirmation" ADD CONSTRAINT "SavedAffirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedAffirmation" ADD CONSTRAINT "SavedAffirmation_affirmationId_fkey" FOREIGN KEY ("affirmationId") REFERENCES "Affirmation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
