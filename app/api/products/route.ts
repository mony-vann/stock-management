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
            "name": "Caramel Macchiato",
            "description": "Espresso with steamed milk and caramel syrup, topped with foam.",
            "status": "active",
            "amount": 50,
            "price": 4.99,
            "totalSales": 150,
            "profile": "/place-holder.png"
          },
          {
            "name": "Vanilla Latte",
            "description": "Espresso with steamed milk and vanilla syrup.",
            "status": "active",
            "amount": 40,
            "price": 4.49,
            "totalSales": 120,
            "profile": "/place-holder.png"
          },
          {
            "name": "Iced Mocha",
            "description": "Espresso with chocolate syrup and cold milk, served over ice.",
            "status": "active",
            "amount": 60,
            "price": 4.79,
            "totalSales": 180,
            "profile": "/place-holder.png"
          },
          {
            "name": "Cappuccino",
            "description": "Equal parts espresso, steamed milk, and milk foam.",
            "status": "active",
            "amount": 35,
            "price": 3.99,
            "totalSales": 105,
            "profile": "/place-holder.png"
          },
          {
            "name": "Hazelnut Frappuccino",
            "description": "Blended coffee with hazelnut syrup, topped with whipped cream.",
            "status": "active",
            "amount": 45,
            "price": 5.49,
            "totalSales": 135,
            "profile": "/place-holder.png"
          },
          {
            "name": "Espresso",
            "description": "Strong black coffee made by forcing steam through finely-ground coffee beans.",
            "status": "active",
            "amount": 55,
            "price": 2.99,
            "totalSales": 165,
            "profile": "/place-holder.png"
          },
          {
            "name": "Flat White",
            "description": "Espresso with velvety steamed milk, less frothy than a latte.",
            "status": "active",
            "amount": 30,
            "price": 4.29,
            "totalSales": 90,
            "profile": "/place-holder.png"
          },
          {
            "name": "Matcha Latte",
            "description": "Green tea powder mixed with steamed milk, served hot or iced.",
            "status": "active",
            "amount": 25,
            "price": 4.99,
            "totalSales": 75,
            "profile": "/place-holder.png"
          },
          {
            "name": "Cold Brew",
            "description": "Coffee brewed with cold water over an extended period, served cold.",
            "status": "active",
            "amount": 65,
            "price": 3.79,
            "totalSales": 195,
            "profile": "/place-holder.png"
          },
          {
            "name": "Pumpkin Spice Latte",
            "description": "Espresso with steamed milk, pumpkin-flavored syrup, and spices.",
            "status": "archived",
            "amount": 20,
            "price": 5.49,
            "totalSales": 60,
            "profile": "/place-holder.png"
          },
          {
            "name": "Chai Tea Latte",
            "description": "Black tea infused with spices and mixed with steamed milk.",
            "status": "active",
            "amount": 40,
            "price": 4.49,
            "totalSales": 120,
            "profile": "/place-holder.png"
          },
          {
            "name": "Affogato",
            "description": "A scoop of vanilla ice cream drowned in a shot of hot espresso.",
            "status": "active",
            "amount": 15,
            "price": 6.99,
            "totalSales": 45,
            "profile": "/place-holder.png"
          },
          {
            "name": "Irish Coffee",
            "description": "Coffee spiked with Irish whiskey, sugar, and topped with cream.",
            "status": "archived",
            "amount": 25,
            "price": 6.49,
            "totalSales": 75,
            "profile": "/place-holder.png"
          },
          {
            "name": "Mocha Latte",
            "description": "Espresso with chocolate syrup and steamed milk.",
            "status": "active",
            "amount": 35,
            "price": 4.29,
            "totalSales": 105,
            "profile": "/place-holder.png"
          },
          {
            "name": "Americano",
            "description": "Espresso diluted with hot water for a stronger black coffee.",
            "status": "archived",
            "amount": 45,
            "price": 3.49,
            "totalSales": 135,
            "profile": "/place-holder.png"
          },
          {
            "name": "Turmeric Latte",
            "description": "Steamed milk with turmeric and other spices, known for its health benefits.",
            "status": "active",
            "amount": 20,
            "price": 5.99,
            "totalSales": 60,
            "profile": "/place-holder.png"
          },
          {
            "name": "Hot Chocolate",
            "description": "Warm chocolatey drink made with cocoa powder, milk, and sugar.",
            "status": "active",
            "amount": 55,
            "price": 3.99,
            "totalSales": 165,
            "profile": "/place-holder.png"
          },
          {
            "name": "Maple Pecan Latte",
            "description": "Espresso with steamed milk, maple syrup, and pecan flavoring.",
            "status": "archived",
            "amount": 30,
            "price": 5.49,
            "totalSales": 90,
            "profile": "/place-holder.png"
          },
          {
            "name": "Coconut Milk Latte",
            "description": "Espresso with steamed coconut milk, for a dairy-free option.",
            "status": "active",
            "amount": 25,
            "price": 4.79,
            "totalSales": 75,
            "profile": "/place-holder.png"
          },
          {
            "name": "Raspberry Mocha",
            "description": "Espresso with raspberry syrup and chocolate sauce, topped with whipped cream.",
            "status": "active",
            "amount": 35,
            "price": 5.29,
            "totalSales": 105,
            "profile": "/place-holder.png"
          }
        ]
        
      });
  
      return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
} 