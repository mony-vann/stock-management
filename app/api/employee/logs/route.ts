import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const recentAttendanceLogs = await db.attendance.findMany({
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
          },
        },
        timestamp: true,
        type: true,
      },
    });

    return NextResponse.json(recentAttendanceLogs);
  } catch (error) {
    console.error("Failed to get recent attendance logs:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
