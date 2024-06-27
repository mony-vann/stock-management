import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    const employee = await db.employee.findFirst({
      where: {
        password: pin,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }
    const lastRecord = await db.attendance.findFirst({
      where: {
        employee_id: employee.id,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    let type;
    if (lastRecord?.type === "check-in") {
      type = "check-out";
    } else {
      type = "check-in";
    }

    await db.attendance.create({
      data: {
        type,
        employee_id: employee.id,
        timestamp: new Date(),
      },
    });

    revalidatePath("/api/employee");

    return NextResponse.json({ attendance: type, employee });
  } catch (error) {
    console.error("Error Checkin", error);
    return NextResponse.error();
  }
}
