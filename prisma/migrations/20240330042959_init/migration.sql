/*
  Warnings:

  - You are about to drop the column `categoryId` on the `SubCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "categoryId";
