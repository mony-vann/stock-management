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
      status: true,
      minutesDifference: true,
    },
  });

  const shifts = await db.shift.findMany();

  attendanceLogs.forEach((log) => {
    const shift = shifts.find((shift) => shift.id === log.employee.shift);
    if (shift) {
      log.employee.shift = shift.name;
    }
  });

  const recentAttendanceLogs = attendanceLogs
    .map((log) => {
      return {
        employeeName: log.employee.name,
        shift: log.employee.shift,
        timestamp: log.timestamp,
        type: log.type,
        status: log.status,
        minutesDiff: log.minutesDifference,
      };
    })
    .slice(0, 50);

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

  // Calculate late check-ins and early check-outs
  const lateCounts = {} as Record<string, number>;
  const earlyLeaveCounts = {} as Record<string, number>;

  attendanceLogs.forEach((log) => {
    if (log.type === "check-in" && log.status === "late") {
      lateCounts[log.employee.id] = (lateCounts[log.employee.id] || 0) + 1;
    }
    if (log.type === "check-out" && log.status === "early") {
      earlyLeaveCounts[log.employee.id] =
        (earlyLeaveCounts[log.employee.id] || 0) + 1;
    }
  });

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

  // Find the staff with the most early leaves
  let maxEarlyLeaves = 0;
  let staffWithMostEarlyLeaves = null;

  for (const [employeeId, earlyLeaveCount] of Object.entries(
    earlyLeaveCounts
  )) {
    if (earlyLeaveCount > maxEarlyLeaves) {
      maxEarlyLeaves = earlyLeaveCount;
      staffWithMostEarlyLeaves = attendanceLogs.find(
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
    staffWithMostEarlyLeaves: staffWithMostEarlyLeaves
      ? {
          name: staffWithMostEarlyLeaves.name,
          earlyLeaveCount: maxEarlyLeaves,
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
