import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
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
      
        return NextResponse.json(recentAttendanceLogs);
    } catch (error) {
        console.error('Failed to get recent attendance logs:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}