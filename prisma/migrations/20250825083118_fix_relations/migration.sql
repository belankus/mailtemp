-- CreateTable
CREATE TABLE "public"."Address" (
    "address" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "fromAddr" TEXT NOT NULL,
    "subject" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snippet" TEXT,
    "r2KeyEml" TEXT NOT NULL,
    "r2KeysAttach" TEXT[],
    "textBody" TEXT,
    "htmlSanitized" TEXT,
    "ttl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
