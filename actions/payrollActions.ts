"use server";

import { db } from "@/lib/db";

export const postPayroll = (data: any) => {
  const { present_days, absent_days, permitted_days, id, logs, amount } = data;

  try {
    const response = db.payroll.create({
      data: {
        present_days,
        absent_days,
        permitted_days,
        logs,
        amount,
        timestamp: new Date(),
        employee_id: id,
      },
    });

    return response;
  } catch (e) {
    console.error("Error creating payroll:", e);
  }
};
