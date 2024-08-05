import { db } from "@/lib/db";

export const getEmployeeById = (id: string) => {
  return db.employee.findUnique({
    where: {
      id,
    },
  });
};

export const getPayrollById = (id: string) => {
  return db.payroll.findMany({
    where: {
      employee_id: id,
    },
  });
};

export const getAttendanceById = (id: string) => {
  return db.attendance.findMany({
    where: {
      employee_id: id,
    },
  });
};

export const getAttendanceForCurrentMonth = (id: string) => {
  return db.attendance.findMany({
    where: {
      employee_id: id,
      timestamp: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });
};

export const getShifts = () => {
  return db.shift.findMany();
};
