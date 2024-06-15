/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `totalSales` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_ProductToSize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToSize" DROP CONSTRAINT "_ProductToSize_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSize" DROP CONSTRAINT "_ProductToSize_B_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
DROP COLUMN "profile",
DROP COLUMN "totalSales",
ALTER COLUMN "amount" SET DEFAULT 0;

-- DropTable
DROP TABLE "_ProductToSize";

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "productId" INTEGER NOT NULL,
    "sizeId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
