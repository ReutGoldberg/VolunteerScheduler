/*
  Warnings:

  - The primary key for the `EventLabelMap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `label` on the `EventLabelMap` table. All the data in the column will be lost.
  - The primary key for the `EventManagerMap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_token` on the `EventManagerMap` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Events` table. All the data in the column will be lost.
  - The primary key for the `Labels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[token]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label_id` to the `EventLabelMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `EventManagerMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventLabelMap" DROP CONSTRAINT "EventLabelMap_label_fkey";

-- DropForeignKey
ALTER TABLE "EventManagerMap" DROP CONSTRAINT "EventManagerMap_user_token_fkey";

-- AlterTable
ALTER TABLE "EventLabelMap" DROP CONSTRAINT "EventLabelMap_pkey",
DROP COLUMN "label",
ADD COLUMN     "label_id" INTEGER NOT NULL,
ADD CONSTRAINT "EventLabelMap_pkey" PRIMARY KEY ("event_id", "label_id");

-- AlterTable
ALTER TABLE "EventManagerMap" DROP CONSTRAINT "EventManagerMap_pkey",
DROP COLUMN "user_token",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "EventManagerMap_pkey" PRIMARY KEY ("event_id", "user_id");

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "end_date",
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Labels" DROP CONSTRAINT "Labels_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Labels_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "time" TIMESTAMP(3),

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingRequests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "PendingRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_token_key" ON "Users"("token");

-- AddForeignKey
ALTER TABLE "EventManagerMap" ADD CONSTRAINT "EventManagerMap_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "Labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRequests" ADD CONSTRAINT "PendingRequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRequests" ADD CONSTRAINT "PendingRequests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
