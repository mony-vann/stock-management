import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const gmt7Offset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
  const gmt7Now = new Date(now.getTime() + gmt7Offset);

  // Set to start of day in GMT+7
  const startOfDay = new Date(
    Date.UTC(
      gmt7Now.getUTCFullYear(),
      gmt7Now.getUTCMonth(),
      gmt7Now.getUTCDate()
    )
  );
  const allLogs = await db.attendance.findMany({
    where: {
      timestamp: {
        gte: startOfDay, // Today's date
      },
    },
    orderBy: {
      timestamp: "desc",
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
  });

  const groupedLogs = allLogs.reduce((acc: any, log) => {
    const name = log.employee.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(log);
    return acc;
  }, {});

  const activeStaffs = Object.values(groupedLogs)
    .map((logs: any) =>
      logs.reduce((a: any, b: any) => (a.timestamp > b.timestamp ? a : b))
    )
    .filter((log) => log.type === "check-in");

  return NextResponse.json(activeStaffs);
}
