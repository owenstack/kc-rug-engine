-- CreateTable
CREATE TABLE "mixer_transaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "cryptocurrency" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "destination_addresses" TEXT NOT NULL,
    "delay_hours" INTEGER NOT NULL,
    "deposit_address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "fee_percentage" DOUBLE PRECISION NOT NULL,
    "network_fee" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "metadata" TEXT,

    CONSTRAINT "mixer_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mixer_wallet" (
    "id" TEXT NOT NULL,
    "cryptocurrency" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "private_key" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mixer_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mixer_transaction_user_id_idx" ON "mixer_transaction"("user_id");

-- CreateIndex
CREATE INDEX "mixer_transaction_deposit_address_idx" ON "mixer_transaction"("deposit_address");

-- CreateIndex
CREATE INDEX "mixer_transaction_status_idx" ON "mixer_transaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mixer_wallet_address_key" ON "mixer_wallet"("address");

-- CreateIndex
CREATE INDEX "mixer_wallet_cryptocurrency_idx" ON "mixer_wallet"("cryptocurrency");

-- CreateIndex
CREATE INDEX "mixer_wallet_is_active_idx" ON "mixer_wallet"("is_active");

-- AddForeignKey
ALTER TABLE "mixer_transaction" ADD CONSTRAINT "mixer_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
