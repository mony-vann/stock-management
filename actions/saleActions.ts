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
  const existingSales = await db.sale.findFirst({
    where: {
      startDate: salesData[0].startDate,
    },
  });

  if (existingSales) {
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
  // Convert the input date to GMT+7
  const clientDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  // Set to start of day in GMT+7
  const startOfDay = new Date(
    Date.UTC(
      clientDate.getUTCFullYear(),
      clientDate.getUTCMonth(),
      clientDate.getUTCDate(),
      -7,
      0,
      0,
      0 // This is equivalent to 00:00:00 in GMT+7
    )
  );

  const startOfNextDay = new Date(
    Date.UTC(
      clientDate.getUTCFullYear(),
      clientDate.getUTCMonth(),
      clientDate.getUTCDate() + 1,
      -7,
      0,
      0,
      0 // This is equivalent to 00:00:00 in GMT+7
    )
  );

  // Set to end of day in GMT+7
  const endOfDay = new Date(
    Date.UTC(
      clientDate.getUTCFullYear(),
      clientDate.getUTCMonth(),
      clientDate.getUTCDate(),
      16,
      59,
      59,
      999 // This is equivalent to 23:59:59.999 in GMT+7
    )
  );

  const dailyReport = await prisma.sale.aggregate({
    where: {
      startDate: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    _count: {
      id: true,
    },
    _sum: {
      grandTotal: true,
      revenue: true,
      subTotal: true,
      vat: true,
      discount: true,
    },
    _avg: {
      grandTotal: true,
    },
    _max: {
      grandTotal: true,
    },
    _min: {
      grandTotal: true,
    },
  });

  return {
    date: startOfNextDay,
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

export const getCurrentMonthSalesReport = async () => {
  const currentDate = new Date();
  const startOfCurrentMonth = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
  );
  const endOfCurrentMonth = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0)
  );

  const summaries = await db.saleSummary.findMany({
    where: {
      data: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    },
  });

  if (summaries.length === 0) {
    return null; // Or you could return a default object with zeros
  }

  const report = summaries.reduce(
    (acc, curr) => ({
      totalSales: acc.totalSales + curr.totalSales,
      totalAmount: acc.totalAmount + curr.totalAmount,
      totalRevenue: acc.totalRevenue + curr.totalRevenue,
      totalSubTotal: acc.totalSubTotal + curr.totalSubTotal,
      totalVAT: acc.totalVAT + curr.totalVAT,
      totalDiscounts: acc.totalDiscounts + curr.totalDiscounts,
      averageSaleAmount: 0, // We'll calculate this after
      largestSale: Math.max(acc.largestSale, curr.largestSale),
      smallestSale: Math.min(acc.smallestSale, curr.smallestSale),
      data: curr.data,
    }),
    {
      totalSales: 0,
      totalAmount: 0,
      totalRevenue: 0,
      totalSubTotal: 0,
      totalVAT: 0,
      totalDiscounts: 0,
      averageSaleAmount: 0,
      largestSale: -Infinity,
      smallestSale: Infinity,
      data: new Date(),
    }
  );

  // Calculate average sale amount
  report.averageSaleAmount = report.totalAmount / report.totalSales;

  return report;
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

export const getDifferencesPercentagesFromLastMonth = async () => {
  const currentDate = new Date();
  const currentMonthStart = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
  );
  const lastMonthStart = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1)
  );

  const currentMonthData = await getCurrentMonthSalesReport();
  const lastMonthData = await getMonthSalesReport(lastMonthStart);

  if (!currentMonthData || !lastMonthData) {
    const percentages = {
      totalSales: 0,
      totalAmount: 0,
      totalRevenue: 0,
      totalSubTotal: 0,
      totalVAT: 0,
      totalDiscounts: 0,
      averageSaleAmount: 0,
      largestSale: 0,
      smallestSale: 0,
    };
    return { percentages };
  }

  const differences = {
    totalSales: currentMonthData.totalSales - lastMonthData.totalSales,
    totalAmount: currentMonthData.totalAmount - lastMonthData.totalAmount,
    totalRevenue: currentMonthData.totalRevenue - lastMonthData.totalRevenue,
    totalSubTotal: currentMonthData.totalSubTotal - lastMonthData.totalSubTotal,
    totalVAT: currentMonthData.totalVAT - lastMonthData.totalVAT,
    totalDiscounts:
      currentMonthData.totalDiscounts - lastMonthData.totalDiscounts,
    averageSaleAmount:
      currentMonthData.averageSaleAmount - lastMonthData.averageSaleAmount,
    largestSale: currentMonthData.largestSale - lastMonthData.largestSale,
    smallestSale: currentMonthData.smallestSale - lastMonthData.smallestSale,
  };

  const percentages = {
    totalSales: calculatePercentage(
      differences.totalSales,
      lastMonthData.totalSales
    ),
    totalAmount: calculatePercentage(
      differences.totalAmount,
      lastMonthData.totalAmount
    ),
    totalRevenue: calculatePercentage(
      differences.totalRevenue,
      lastMonthData.totalRevenue
    ),
    totalSubTotal: calculatePercentage(
      differences.totalSubTotal,
      lastMonthData.totalSubTotal
    ),
    totalVAT: calculatePercentage(differences.totalVAT, lastMonthData.totalVAT),
    totalDiscounts: calculatePercentage(
      differences.totalDiscounts,
      lastMonthData.totalDiscounts
    ),
    averageSaleAmount: calculatePercentage(
      differences.averageSaleAmount,
      lastMonthData.averageSaleAmount
    ),
    largestSale: calculatePercentage(
      differences.largestSale,
      lastMonthData.largestSale
    ),
    smallestSale: calculatePercentage(
      differences.smallestSale,
      lastMonthData.smallestSale
    ),
  };

  return {
    differences,
    percentages,
  };
};

// Helper function to calculate percentage and handle division by zero
function calculatePercentage(difference: number, base: number): number {
  if (base === 0) {
    return difference > 0 ? Infinity : difference < 0 ? -Infinity : 0;
  }
  return (difference / base) * 100;
}

// Function to get sales report for a specific month
export const getMonthSalesReport = async (date: Date) => {
  const startOfTargetMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  );
  const endOfTargetMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  );

  const summaries = await db.saleSummary.findMany({
    where: {
      data: {
        gte: startOfTargetMonth,
        lte: endOfTargetMonth,
      },
    },
  });

  if (summaries.length === 0) {
    return null;
  }

  const report = summaries.reduce(
    (acc, curr) => ({
      totalSales: acc.totalSales + curr.totalSales,
      totalAmount: acc.totalAmount + curr.totalAmount,
      totalRevenue: acc.totalRevenue + curr.totalRevenue,
      totalSubTotal: acc.totalSubTotal + curr.totalSubTotal,
      totalVAT: acc.totalVAT + curr.totalVAT,
      totalDiscounts: acc.totalDiscounts + curr.totalDiscounts,
      averageSaleAmount: 0, // We'll calculate this after
      largestSale: Math.max(acc.largestSale, curr.largestSale),
      smallestSale: Math.min(acc.smallestSale, curr.smallestSale),
      data: curr.data,
    }),
    {
      totalSales: 0,
      totalAmount: 0,
      totalRevenue: 0,
      totalSubTotal: 0,
      totalVAT: 0,
      totalDiscounts: 0,
      averageSaleAmount: 0,
      largestSale: -Infinity,
      smallestSale: Infinity,
      data: new Date(),
    }
  );

  // Calculate average sale amount
  report.averageSaleAmount = report.totalAmount / report.totalSales;

  return report;
};
