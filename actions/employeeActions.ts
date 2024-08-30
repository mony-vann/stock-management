import { db } from "@/lib/db";
import * as XLSX from "xlsx";

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

export const exportEmployeeCurrentMonthAttandence = async (
  name: string,
  data: any,
  selectedMonth: string,
  selectedYear: string
) => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    // Apply styles to the summary rows
    const summaryRange = ws["!ref"]
      ? XLSX.utils.decode_range(ws["!ref"])
      : null;
    const summaryRowStart = summaryRange!.e.r - 3;
    for (let R = summaryRowStart; R <= summaryRange!.e.r; ++R) {
      for (let C = summaryRange!.s.c; C <= summaryRange!.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        ws[cell_ref].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "FFFF00" } },
        };
      }
    }

    XLSX.writeFile(
      wb,
      `Attendance_${selectedMonth}_${selectedYear}_${name}.xlsx`
    );
  } catch (error) {
    console.error("Error exporting attendance:", error);
  }
};
