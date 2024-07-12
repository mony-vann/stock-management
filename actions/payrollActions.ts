"use server";

import { db } from "@/lib/db";

export const postPayroll = async (data: any) => {
  const {
    present_days,
    absent_days,
    permitted_days,
    id,
    logs,
    amount,
    earned,
    deductions,
  } = data;

  if (present_days <= 0 || absent_days < 0 || permitted_days < 0) {
    console.error("Invalid days provided.");
    return;
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
  const currentYear = currentDate.getFullYear();

  const existingPayroll = await db.payroll.findFirst({
    where: {
      employee_id: id,
      timestamp: {
        gte: new Date(`${currentYear}-${currentMonth}-01`),
        lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
      },
    },
  });

  if (existingPayroll) {
    console.log("Payroll for the current month already exists.");
    return;
  }

  // Continue with creating the payroll entry for the current month

  try {
    const response = await db.payroll.create({
      data: {
        present_days,
        absent_days,
        permitted_days,
        logs,
        amount,
        earned,
        deductions,
        timestamp: new Date(),
        employee_id: id,
      },
    });

    return response;
  } catch (e) {
    console.error("Error creating payroll:", e);
  }
};
