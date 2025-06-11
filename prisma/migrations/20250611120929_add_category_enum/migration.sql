/*
  Warnings:

  - Changed the type of `category` on the `Affirmation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AffirmationCategory" AS ENUM ('MINDFULNESS', 'INTENTION', 'GRATITUDE', 'SELF_LOVE', 'MOTIVATION', 'HEALTH', 'CAREER', 'FRIENDSHIP', 'FAMILY', 'SPIRITUALITY', 'POSITIVITY', 'CALMNESS', 'CONFIDENCE', 'WELLNESS', 'SUCCESS', 'HAPPINESS', 'PEACE');

-- AlterTable
ALTER TABLE "Affirmation" DROP COLUMN "category",
ADD COLUMN     "category" "AffirmationCategory" NOT NULL;
