/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `subCategoryId` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "subCategoryId";

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "subCategoryId" INTEGER NOT NULL;
