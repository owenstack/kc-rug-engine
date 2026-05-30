-- CreateTable
CREATE TABLE "coin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "twitterUrl" TEXT NOT NULL,
    "telegramUrl" TEXT NOT NULL,
    "marketCap" INTEGER NOT NULL,
    "revoke" TEXT[],
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundled_wallet" (
    "id" TEXT NOT NULL,
    "devBuyAmount" INTEGER NOT NULL,
    "bundledByAmount" INTEGER NOT NULL,
    "bundledWalletAmount" INTEGER NOT NULL,
    "slippage" INTEGER NOT NULL,
    "bundledLaunchType" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,

    CONSTRAINT "bundled_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volume" (
    "id" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "minBuyAmount" INTEGER NOT NULL,
    "maxBuyAmount" INTEGER NOT NULL,
    "slippage" INTEGER NOT NULL,
    "delay" INTEGER NOT NULL,

    CONSTRAINT "volume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bundled_wallet_coinId_key" ON "bundled_wallet"("coinId");

-- CreateIndex
CREATE UNIQUE INDEX "volume_coinId_key" ON "volume"("coinId");

-- CreateIndex
CREATE INDEX "document_user_id_idx" ON "document"("user_id");

-- CreateIndex
CREATE INDEX "document_key_idx" ON "document"("key");

-- AddForeignKey
ALTER TABLE "coin" ADD CONSTRAINT "coin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundled_wallet" ADD CONSTRAINT "bundled_wallet_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "coin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume" ADD CONSTRAINT "volume_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
