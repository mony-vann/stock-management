/*
  Warnings:

  - You are about to drop the column `employee_id` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_employee_id_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "employee_id";

-- CreateTable
CREATE TABLE "_EmployeeToShift" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToShift_AB_unique" ON "_EmployeeToShift"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToShift_B_index" ON "_EmployeeToShift"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeToShift" ADD CONSTRAINT "_EmployeeToShift_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToShift" ADD CONSTRAINT "_EmployeeToShift_B_fkey" FOREIGN KEY ("B") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
