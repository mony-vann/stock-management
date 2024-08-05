"use server";

import { db } from "@/lib/db";
import { ReportColumn } from "@/app/(dashboard)/report/_components/column";

export const getReports = async (month: string, year: string) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === month.toLowerCase()
  );
  if (monthIndex === -1) {
    throw new Error("Invalid month name");
  }

  const yearNumber = parseInt(year, 10);

  // Create Date objects for the start and end of the month
  const startDate = new Date(yearNumber, monthIndex, 1);
  const endDate = new Date(yearNumber, monthIndex + 1, 0);
  console.log("Start date", startDate);
  console.log("End date", endDate);

  // Set the time to the start and end of the day
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const saleReports = await db.saleSummary.findMany({
    where: {
      data: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      data: "asc",
    },
  });

  const drinkReports = await db.bottleSaleSummary.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  let formattedReports = saleReports.map((sale) => {
    const matchingDrink = drinkReports.find(
      (drink) =>
        drink.date.toDateString() ===
        new Date(sale.data.getTime() - 17 * 60 * 60 * 1000).toDateString()
    );

    return {
      date: matchingDrink?.date || sale.data,
      sales: sale.totalSales,
      revenue: sale.totalRevenue,
      drinks: matchingDrink ? matchingDrink.totalQuantity : 0,
    };
  });

  return formattedReports;
};
