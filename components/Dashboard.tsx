"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import Donut_Chart from "./ui/donut-chart";
import Bar_Chart from "./ui/bar-chart";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  getDailySales,
  getDifferencesPercentagesFromYesterday,
  getLatestSummaries,
} from "@/actions/saleActions";
import { SummaryCardSkeletons } from "./dashboard/SummaryCardSkeletons";

interface DailyReport {
  data: Date;
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

interface Difference {
  totalSales: number;
  totalAmount: number;
  totalRevenue: number;
  totalSubTotal: number;
  totalVAT: number;
  totalDiscounts: number;
  averageSaleAmount: number;
  largestSale: number;
  smallestSale: number;
}

export function Dashboard() {
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [d, setD] = useState<Difference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [day, setDay] = useState<number>(10);
  const [dayName, setDayName] = useState<string>("Monday");
  const [month, setMonth] = useState<string>("June");
  const [year, setYear] = useState<number>(2024);

  let daySuffix;
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  useEffect(() => {
    const fetchDailySales = async () => {
      setIsLoading(true);
      try {
        const response = await getLatestSummaries();
        const differences = await getDifferencesPercentagesFromYesterday();

        setDay(response!.data.getDate());
        setDayName(response!.data.toLocaleString("en-US", { weekday: "long" }));
        setMonth(response!.data.toLocaleString("en-US", { month: "long" }));
        setYear(response!.data.getFullYear());

        setDailyReport(response);
        setD(differences);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailySales();
  }, []);

  const formattedDay = day + daySuffix;
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="flex items-center mx-10 mt-10">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your shop.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-x-10">
            <div>
              <h1 className="text-2xl font-semibold">
                {dayName}, {formattedDay}
              </h1>
              <h3 className="text-xl font-medium text-end">
                {month}, {year}
              </h3>
            </div>
            <div>
              <UserButton />
            </div>
          </div>
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-8">
          {isLoading ? (
            <SummaryCardSkeletons />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dailyReport?.totalRevenue}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d?.totalRevenue.toFixed(2)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{dailyReport?.totalSales}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d?.totalSales.toFixed(2)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Sale Amount
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dailyReport?.averageSaleAmount?.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d?.averageSaleAmount.toFixed(2)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Largest Sale Amount
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dailyReport?.largestSale}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d?.largestSale.toFixed(2)}% from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
            <div className="col-span-2 xl:col-span-3">
              <Bar_Chart />
            </div>
            <div className="xl:col-span-2">
              <Donut_Chart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
