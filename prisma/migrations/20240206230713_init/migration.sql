-- CreateTable
CREATE TABLE "listing" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);
