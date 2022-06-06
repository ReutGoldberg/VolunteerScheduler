/*
  Warnings:

  - You are about to drop the `test_person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test_person";

-- CreateTable
CREATE TABLE "Users" (
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "location" TEXT,
    "min_volenteering" INTEGER,
    "max_volenteering" INTEGER,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labels" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Labels_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "EventManagerMap" (
    "event_id" INTEGER NOT NULL,
    "user_token" TEXT NOT NULL,

    CONSTRAINT "EventManagerMap_pkey" PRIMARY KEY ("event_id","user_token")
);

-- CreateTable
CREATE TABLE "EventLabelMap" (
    "event_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "EventLabelMap_pkey" PRIMARY KEY ("event_id","label")
);

-- AddForeignKey
ALTER TABLE "EventManagerMap" ADD CONSTRAINT "EventManagerMap_user_token_fkey" FOREIGN KEY ("user_token") REFERENCES "Users"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventManagerMap" ADD CONSTRAINT "EventManagerMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_label_fkey" FOREIGN KEY ("label") REFERENCES "Labels"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
