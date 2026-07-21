-- CreateEnum
CREATE TYPE "StripeOrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "StripeOrder" (
    "id" TEXT NOT NULL,
    "serviceSlug" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "amountUSD" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "fullName" TEXT NOT NULL,
    "businessName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "website" TEXT,
    "notes" TEXT,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "status" "StripeOrderStatus" NOT NULL DEFAULT 'PENDING',
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "StripeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeOrder_stripeSessionId_key" ON "StripeOrder"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeOrder_stripePaymentIntentId_key" ON "StripeOrder"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "StripeOrder_status_idx" ON "StripeOrder"("status");

-- CreateIndex
CREATE INDEX "StripeOrder_email_idx" ON "StripeOrder"("email");
