import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST() {
  try {
    const products = await db.product.createMany({
      data: [],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
