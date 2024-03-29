import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { journalId: string }, }
) {
    try {
        const products = await db.product.findMany();
        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function POST (
    req: Request,
    { params }: { params: { journalId: string }, }
) {
    try {
    const products = await db.product.createMany({
        data: [
          {
            name: "Laser Lemonade Machine",
            description: "Draft",
            status: "Draft",
            price: 499.99,
            totalSales: 25,
            profile: "2023-07-12 10:42 AM",
          },
          {
            name: "Hypernova Headphones",
            description: "Active",
            status: "Active",
            price: 129.99,
            totalSales: 100,
            profile: "2023-10-18 03:21 PM",
          },
          {
            name: "AeroGlow Desk Lamp",
            description: "Active",
            status: "Active",
            price: 39.99,
            totalSales: 50,
            profile: "2023-11-29 08:15 AM",
          },
          {
            name: "TechTonic Energy Drink",
            description: "Draft",
            status: "Draft",
            price: 2.99,
            totalSales: 0,
            profile: "2023-12-25 11:59 PM",
          },
          {
            name: "Gamer Gear Pro Controller",
            description: "Active",
            status: "Active",
            price: 59.99,
            totalSales: 75,
            profile: "2024-01-01 12:00 AM",
          },
          {
            name: "Luminous VR Headset",
            description: "Active",
            status: "Active",
            price: 199.99,
            totalSales: 30,
            profile: "2024-02-14 02:14 PM",
          },
        ],
      });
  
      return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
} 