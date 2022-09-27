/*
  Warnings:

  - You are about to drop the `EventManagerMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventManagerMap" DROP CONSTRAINT "EventManagerMap_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventManagerMap" DROP CONSTRAINT "EventManagerMap_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PendingRequests" DROP CONSTRAINT "PendingRequests_event_id_fkey";

-- DropForeignKey
ALTER TABLE "PendingRequests" DROP CONSTRAINT "PendingRequests_user_id_fkey";

-- DropTable
DROP TABLE "EventManagerMap";

-- DropTable
DROP TABLE "Logs";

-- DropTable
DROP TABLE "PendingRequests";
