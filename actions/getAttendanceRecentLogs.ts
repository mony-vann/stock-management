import { db } from "@/lib/db";
import {cache} from 'react'

export const revalidate = 10;

export const getAttendanceRecentLogs = cache( async () => {
    const recentAttendanceLogs = await db.attendance.findMany({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's date
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        select: {
          employee: {
            select: {
              name: true,
            },
          },
          timestamp: true,
          type: true,
        },
      });
    return recentAttendanceLogs;
})

export const getActiveStaffs = async () => {
  const allLogs = await db.attendance.findMany({
    where: {
        timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's date
        },
    },
    orderBy: {
        timestamp: 'desc',
    },
    select: {
        employee: {
            select: {
                name: true,
                role: true,
            },
        },
        timestamp: true,
        type: true,
    },
  })

  const groupedLogs = allLogs.reduce((acc: any, log) => {
    const name = log.employee.name;
    if (!acc[name]) {
        acc[name] = [];
    }
    acc[name].push(log);
    return acc;
  }, {});

  const activeStaffs = Object.values(groupedLogs)
    .map((logs: any) => logs.reduce((a:any, b:any) => (a.timestamp > b.timestamp ? a : b)))
    .filter((log) => log.type === 'check-in');


  return activeStaffs;
}