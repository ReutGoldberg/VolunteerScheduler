/*
  Warnings:

  - You are about to drop the column `label` on the `Events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventLabelMap" DROP CONSTRAINT "EventLabelMap_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventLabelMap" DROP CONSTRAINT "EventLabelMap_label_id_fkey";

-- DropForeignKey
ALTER TABLE "EventVolunteerMap" DROP CONSTRAINT "EventVolunteerMap_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventVolunteerMap" DROP CONSTRAINT "EventVolunteerMap_user_id_fkey";

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "label";

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "Labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteerMap" ADD CONSTRAINT "EventVolunteerMap_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteerMap" ADD CONSTRAINT "EventVolunteerMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
