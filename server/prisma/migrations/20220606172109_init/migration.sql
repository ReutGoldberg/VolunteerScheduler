-- CreateTable
CREATE TABLE "EventVolunteerMap" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "EventVolunteerMap_pkey" PRIMARY KEY ("event_id","user_id")
);

-- AddForeignKey
ALTER TABLE "EventVolunteerMap" ADD CONSTRAINT "EventVolunteerMap_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteerMap" ADD CONSTRAINT "EventVolunteerMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
