"use server";

import { db } from "@/lib/db";

interface Bottle {
  itemCode: string;
  itemName: string;
}

interface BottleSale {
  date: Date;
  itemCode: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subTotal: number;
  tax: number;
  free: number;
  cost: number;
  extPrice: number;
  extCost: number;
  margin: number;
}

interface BottleSaleSummary {
  date: Date;
  totalQuantity: number;
  totalSubTotal: number;
}

export const postBottleSaleData = async (bottleSales: BottleSale[]) => {
  const data = bottleSales.slice(1).map((sale) => ({
    date: sale.date,
    itemCode: sale.itemCode,
    itemDescription: sale.itemDescription,
    quantity: sale.quantity,
    unitPrice: sale.unitPrice,
    discount: sale.discount,
    subTotal: sale.subTotal,
    tax: sale.tax,
    free: sale.free ? sale.free : 0,
    cost: sale.cost,
    extPrice: sale.extPrice,
    extCost: sale.extCost,
    margin: sale.margin,
  }));

  const existingBottlesData = await db.bottleSaleSummary.findFirst({
    where: {
      date: data[0].date,
    },
  });

  if (existingBottlesData) {
    throw new Error("Bottle sales data already exists for this date");
  }

  try {
    const response = await db.bottleSale.createMany({
      data: data,
    });
    return response;
  } catch (error) {
    console.error("Error uploading data:", error);
    throw error;
  }
};

export const getBottles = async () => {
  try {
    const response = await db.bottle.findMany();
    return response;
  } catch (error) {
    console.error("Error fetching bottles:", error);
    throw error;
  }
};

export const getLatestAmountSoldEachBottle = async () => {
  try {
    const latestDateQuery = await db.bottleSale.findFirst({
      orderBy: {
        date: "desc",
      },
      select: {
        date: true,
      },
    });

    if (!latestDateQuery) {
      console.log("No sales data found");
      return [];
    }

    const latestDate = latestDateQuery.date;

    const response = await db.bottleSale.findMany({
      where: {
        date: latestDate,
      },
      select: {
        itemCode: true,
        itemDescription: true,
        quantity: true,
        extPrice: true,
        date: true,
      },
    });

    const bottles = await getBottles();

    const bottleMap = bottles.reduce((acc, bottle) => {
      acc[bottle.itemCode] = bottle.itemName;
      return acc;
    }, {} as Record<string, string>);

    response.forEach((sale) => {
      sale.itemDescription = bottleMap[sale.itemCode];
    });

    const groupedSales: Record<string, any[]> = {};
    response.forEach((sale) => {
      const itemCode = sale.itemCode;
      const groupKey = itemCode.length >= 7 ? itemCode.slice(0, -2) : itemCode;
      if (!groupedSales[groupKey]) {
        groupedSales[groupKey] = [];
      }
      groupedSales[groupKey].push(sale);
    });

    return groupedSales;
  } catch (error) {
    console.error("Error fetching amount sold each bottle:", error);
    throw error;
  }
};

export const getDailyBottleSales = async (date: Date) => {
  try {
    const response = await db.bottleSale.aggregate({
      where: {
        date: date,
      },
      _sum: {
        quantity: true,
        subTotal: true,
        extPrice: true,
        extCost: true,
        margin: true,
      },
    });

    return {
      date: date,
      totalQuantity: response._sum.quantity,
      totalSubTotal: response._sum.subTotal,
      totalExtPrice: response._sum.extPrice,
      totalExtCost: response._sum.extCost,
      totalMargin: response._sum.margin,
    };
  } catch (error) {
    console.error("Error fetching daily bottle sales:", error);
    throw error;
  }
};

export const getBottleSaleSummary = async () => {
  try {
    const response = await db.bottleSaleSummary.findMany();
    return response;
  } catch (error) {
    console.error("Error fetching bottle sales summary:", error);
    throw error;
  }
};

export const getCurrentMonthBottleSaleSummary = async () => {
  try {
    const response = await db.bottleSaleSummary.findMany({
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });
    const totalQuantity = response.reduce(
      (acc, summary) => acc + summary.totalQuantity,
      0
    );
    const totalMargin = response.reduce(
      (acc, summary) => acc + summary.totalMargin,
      0
    );
    return {
      totalQuantity,
      totalMargin,
    };
  } catch (error) {
    console.error("Error fetching current month bottle sales summary:", error);
    throw error;
  }
};

export const postBottleSaleSummary = async (date: Date) => {
  const data = await getDailyBottleSales(date);
  try {
    const response = await db.bottleSaleSummary.create({
      data: {
        date: date,
        totalQuantity: data.totalQuantity || 0,
        totalMargin: data.totalMargin || 0,
      },
    });
    return response;
  } catch (error) {
    console.error("Error posting bottle sales summary:", error);
    throw error;
  }
};

// Add this to your server actions file

export const getDrinkTrendData = async (
  itemCode: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const response = await db.bottleSale.groupBy({
      by: ["date"],
      where: {
        itemCode: itemCode,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return response.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      quantity: item._sum.quantity || 0,
    }));
  } catch (error) {
    console.error("Error fetching drink trend data:", error);
    throw error;
  }
};
