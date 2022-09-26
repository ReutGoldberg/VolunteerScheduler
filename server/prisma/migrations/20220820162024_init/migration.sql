/*
  Warnings:

  - You are about to drop the column `is_fake` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `is_fake` on the `Labels` table. All the data in the column will be lost.
  - You are about to drop the column `is_fake` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `is_fake` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "is_fake";

-- AlterTable
ALTER TABLE "Labels" DROP COLUMN "is_fake";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "is_fake";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "is_fake";
