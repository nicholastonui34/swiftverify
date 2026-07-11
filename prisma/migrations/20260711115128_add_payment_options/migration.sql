-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MPESA', 'USDT_TRC20', 'BINANCE_PAY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MPESA';
