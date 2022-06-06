-- CreateTable
CREATE TABLE "test_person" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,

    CONSTRAINT "test_person_pkey" PRIMARY KEY ("id")
);
