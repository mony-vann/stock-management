// postSaleData.ts
"use server";

import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

interface SaleData {
  invoiceNo: string;
  startDate: Date;
  stopDate: Date;
  cashier: string;
  tableNo: string;
  subTotal: number;
  vat: number;
  discount: number;
  grandTotal: number;
  free: number;
  balance: number;
  recDollar: number;
  riel: number;
  creditCard: number;
  revenue: number;
}

interface DailyReport {
  date: Date;
  totalSales: number | null;
  totalAmount: number | null;
  totalRevenue: number | null;
  totalSubTotal: number | null;
  totalVAT: number | null;
  totalDiscounts: number | null;
  averageSaleAmount: number | null;
  largestSale: number | null;
  smallestSale: number | null;
}

export const postSaleData = async (salesData: SaleData[]) => {
  console.log("Uploading sales data:", salesData[0].startDate);
  const existingSales = await db.saleSummary.findMany({
    where: {
      data: salesData[0].startDate,
    },
  });

  console.log("Existing sales data:", existingSales);

  if (existingSales.length > 0) {
    throw new Error("Sales data already exists for the given start date");
  }

  try {
    const response = await db.sale.createMany({
      data: salesData,
    });
    return response;
  } catch (error) {
    console.error("Error uploading data:", error);
    throw error;
  }
};

const prisma = new PrismaClient();

export const getDailySales = async (date: Date) => {
  const startOfDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const endOfDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  );

  const dailyReport = await prisma.sale.aggregate({
    where: {
      startDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    _count: {
      id: true, // Total number of sales
    },
    _sum: {
      grandTotal: true, // Total sales amount
      revenue: true, // Total revenue
      subTotal: true, // Total before tax and discounts
      vat: true, // Total VAT
      discount: true, // Total discounts
    },
    _avg: {
      grandTotal: true, // Average sale amount
    },
    _max: {
      grandTotal: true, // Largest sale
    },
    _min: {
      grandTotal: true, // Smallest sale
    },
  });

  return {
    date: startOfDay,
    totalSales: dailyReport._count.id,
    totalAmount: dailyReport._sum.grandTotal,
    totalRevenue: dailyReport._sum.revenue,
    totalSubTotal: dailyReport._sum.subTotal,
    totalVAT: dailyReport._sum.vat,
    totalDiscounts: dailyReport._sum.discount,
    averageSaleAmount: dailyReport._avg.grandTotal,
    largestSale: dailyReport._max.grandTotal,
    smallestSale: dailyReport._min.grandTotal,
  };
};

export const postDailyReport = async (date: Date) => {
  const data = await getDailySales(date);
  try {
    const response = await db.saleSummary.create({
      data: {
        data: data.date,
        totalSales: data.totalSales,
        totalAmount: data.totalAmount ? data.totalAmount : 0,
        totalRevenue: data.totalRevenue ? data.totalRevenue : 0,
        totalSubTotal: data.totalSubTotal ? data.totalSubTotal : 0,
        totalVAT: data.totalVAT ? data.totalVAT : 0,
        totalDiscounts: data.totalDiscounts ? data.totalDiscounts : 0,
        averageSaleAmount: data.averageSaleAmount ? data.averageSaleAmount : 0,
        largestSale: data.largestSale ? data.largestSale : 0,
        smallestSale: data.smallestSale ? data.smallestSale : 0,
      },
    });
    return response;
  } catch (error) {
    console.error("Error uploading data:", error);
    throw error;
  }
};

export const getLatestSummaries = async () => {
  const latestSummary = await db.saleSummary.findFirst({
    orderBy: {
      data: "desc",
    },
  });
  return latestSummary;
};

export const getSummaries = async () => {
  const summaries = await db.saleSummary.findMany({
    orderBy: {
      data: "desc",
    },
  });
  return summaries;
};

export const getDifferencesPercentagesFromYesterday = async () => {
  const summaries = await db.saleSummary.findMany({
    orderBy: {
      data: "desc",
    },
    take: 2,
  });

  if (!summaries || summaries.length < 2) {
    throw new Error("Not enough data to compare");
  }

  const yesterdayData = await getDailySales(summaries[1].data);
  const todayData = await getDailySales(summaries[0].data);

  const differences = {
    totalSales: todayData.totalSales - yesterdayData.totalSales,
    totalAmount:
      (todayData.totalAmount || 0) - (yesterdayData.totalAmount || 0),
    totalRevenue:
      (todayData.totalRevenue || 0) - (yesterdayData.totalRevenue || 0),
    totalSubTotal:
      (todayData.totalSubTotal || 0) - (yesterdayData.totalSubTotal || 0),
    totalVAT: (todayData.totalVAT || 0) - (yesterdayData.totalVAT || 0),
    totalDiscounts:
      (todayData.totalDiscounts || 0) - (yesterdayData.totalDiscounts || 0),
    averageSaleAmount:
      (todayData.averageSaleAmount || 0) -
      (yesterdayData.averageSaleAmount || 0),
    largestSale:
      (todayData.largestSale || 0) - (yesterdayData.largestSale || 0),
    smallestSale:
      (todayData.smallestSale || 0) - (yesterdayData.smallestSale || 0),
  };

  const percentages = {
    totalSales: (differences.totalSales / yesterdayData.totalSales) * 100,
    totalAmount:
      (differences.totalAmount / (yesterdayData.totalAmount || 0)) * 100,
    totalRevenue:
      (differences.totalRevenue / (yesterdayData.totalRevenue || 0)) * 100,
    totalSubTotal:
      (differences.totalSubTotal / (yesterdayData.totalSubTotal || 0)) * 100,
    totalVAT: (differences.totalVAT / (yesterdayData.totalVAT || 0)) * 100,
    totalDiscounts:
      (differences.totalDiscounts / (yesterdayData.totalDiscounts || 0)) * 100,
    averageSaleAmount:
      (differences.averageSaleAmount / (yesterdayData.averageSaleAmount || 0)) *
      100,
    largestSale:
      (differences.largestSale / (yesterdayData.largestSale || 0)) * 100,
    smallestSale:
      (differences.smallestSale / (yesterdayData.smallestSale || 0)) * 100,
  };

  return percentages;
};
