/*
  Warnings:

  - Added the required column `image` to the `coin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coin" ADD COLUMN     "image" TEXT NOT NULL;
