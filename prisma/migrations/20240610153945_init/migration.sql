/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attendance_id` on the `Attendance` table. All the data in the column will be lost.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employee_id` on the `Employee` table. All the data in the column will be lost.
  - The primary key for the `Salary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `salary_id` on the `Salary` table. All the data in the column will be lost.
  - The primary key for the `Shift` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shift_id` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_employee_id_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "attendance_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "employee_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_pkey",
DROP COLUMN "salary_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Salary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_pkey",
DROP COLUMN "shift_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Shift_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
