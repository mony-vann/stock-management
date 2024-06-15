import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const response = await db.shift.findMany();

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.error();
  }
}
