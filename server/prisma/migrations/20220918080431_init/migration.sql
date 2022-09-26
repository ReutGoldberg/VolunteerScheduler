/*
  Warnings:

  - You are about to drop the column `max_volenteering` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `min_volenteering` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "max_volenteering",
DROP COLUMN "min_volenteering",
ADD COLUMN     "max_volunteers" INTEGER,
ADD COLUMN     "min_volunteers" INTEGER;
