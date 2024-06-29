"use server";

import { db } from "@/lib/db";

export const getAttendanceData = async () => {
  const attendanceLogs = await db.attendance.findMany({
    orderBy: {
      timestamp: "desc",
    },
    select: {
      employee: {
        select: {
          id: true,
          name: true,
          role: true,
          shift: true,
        },
      },
      timestamp: true,
      type: true,
    },
  });

  const recentAttendanceLogs = attendanceLogs
    .map((log) => ({
      employeeName: log.employee.name,
      timestamp: log.timestamp,
      type: log.type,
    }))
    .slice(0, 10);

  const groupedLogs = attendanceLogs.reduce((acc, log) => {
    const name = log.employee.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(log);
    return acc;
  }, {} as Record<string, typeof attendanceLogs>);

  const activeStaffs = Object.values(groupedLogs)
    .map((logs) => logs[0]) // Take the most recent log for each employee
    .filter((log) => log.type === "check-in")
    .map((log) => ({
      name: log.employee.name,
      role: log.employee.role,
      timestamp: log.timestamp,
    }));

  // Fetch all shifts
  const shifts = await db.shift.findMany();

  // Calculate late check-ins
  const lateCounts = attendanceLogs.reduce((acc, log) => {
    if (log.type === "check-in" && log.employee.shift) {
      const shift = shifts.find((s) => s.id === log.employee.shift);
      if (shift) {
        const shiftStart = new Date(log.timestamp);
        shiftStart.setHours(shift.start_time.getHours());
        shiftStart.setMinutes(shift.start_time.getMinutes());
        if (log.timestamp < shiftStart) {
          acc[log.employee.id] = (acc[log.employee.id] || 0) + 1;
        }
      }
    }
    return acc;
  }, {} as Record<string, number>);

  // Find the staff with the most lates
  let maxLates = 0;
  let staffWithMostLates = null;

  for (const [employeeId, lateCount] of Object.entries(lateCounts)) {
    if (lateCount > maxLates) {
      maxLates = lateCount;
      staffWithMostLates = attendanceLogs.find(
        (log) => log.employee.id === employeeId
      )?.employee;
    }
  }

  return {
    recentAttendanceLogs,
    activeStaffs,
    staffWithMostLates: staffWithMostLates
      ? {
          name: staffWithMostLates.name,
          lateCount: maxLates,
        }
      : null,
    timeStamp: new Date(),
  };
};

export const getAttendanceByIdAndDate = async (
  employee_id: string,
  month: string,
  year: string
) => {
  const attendanceLogs = await db.attendance.findMany({
    where: {
      employee_id,
      timestamp: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return attendanceLogs;
};
