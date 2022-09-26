-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "is_fake" BOOLEAN NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
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
    "end_time" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "is_fake" BOOLEAN NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_fake" BOOLEAN NOT NULL,

    CONSTRAINT "Labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventManagerMap" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "EventManagerMap_pkey" PRIMARY KEY ("event_id","user_id")
);

-- CreateTable
CREATE TABLE "EventLabelMap" (
    "event_id" INTEGER NOT NULL,
    "label_id" INTEGER NOT NULL,

    CONSTRAINT "EventLabelMap_pkey" PRIMARY KEY ("event_id","label_id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "time" TIMESTAMP(3),
    "is_fake" BOOLEAN NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingRequests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "PendingRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVolunteerMap" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "EventVolunteerMap_pkey" PRIMARY KEY ("event_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_token_key" ON "Users"("token");

-- AddForeignKey
ALTER TABLE "EventManagerMap" ADD CONSTRAINT "EventManagerMap_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventManagerMap" ADD CONSTRAINT "EventManagerMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLabelMap" ADD CONSTRAINT "EventLabelMap_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "Labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRequests" ADD CONSTRAINT "PendingRequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRequests" ADD CONSTRAINT "PendingRequests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteerMap" ADD CONSTRAINT "EventVolunteerMap_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteerMap" ADD CONSTRAINT "EventVolunteerMap_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
