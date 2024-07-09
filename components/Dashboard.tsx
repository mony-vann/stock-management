"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  CupSoda,
  Percent,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  getCurrentMonthSalesReport,
  getDailySales,
  getDifferencesPercentagesFromLastMonth,
  getDifferencesPercentagesFromYesterday,
  getLatestSummaries,
} from "@/actions/saleActions";
import { SummaryCardSkeletons } from "./dashboard/SummaryCardSkeletons";
import SaleChart from "./dashboard/SaleChart";
import FixedExpensePieChart from "./dashboard/FixedExpensePieChart";
import BottleAmountChart from "./dashboard/BottleAmountChart";
import SaleRevenueChart from "./dashboard/SaleRevenueChart";
import TopDrinkChart from "./dashboard/TopDrinkChart";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getCurrentMonthBottleSaleSummary } from "@/actions/bottleSaleActions";

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
  const [monthlyBottle, setMonthlyBottle] = useState<number | null>(null);
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
        const response = await getCurrentMonthSalesReport();
        const differences = await getDifferencesPercentagesFromLastMonth();
        const montlyBottleReport = await getCurrentMonthBottleSaleSummary();

        setDay(response!.data.getDate());
        setDayName(response!.data.toLocaleString("en-US", { weekday: "long" }));
        setMonth(response!.data.toLocaleString("en-US", { month: "long" }));
        setYear(response!.data.getFullYear());

        setDailyReport(response);
        setD(differences.percentages);
        setMonthlyBottle(montlyBottleReport.totalQuantity);
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
              <h3 className="text-2xl font-medium text-end">
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
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center justify-between w-full">
                    <Button variant={"muted"} disabled className="rounded-xl">
                      <DollarSign className="h-4 w-4 text-gray-900" />
                    </Button>
                    {d?.totalRevenue! >= 0 ? (
                      <Badge className="rounded-full bg-blue-600 hover:bg-blue-600 text-sm">
                        +{d?.totalRevenue.toFixed(2)}%
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-red-600 hover:bg-red-600 text-sm">
                        {d?.totalRevenue.toFixed(2)}%
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                  <p className="text-sm">Total Revenue</p>
                  <div className="flex items-center gap-x-1">
                    <div className="text-3xl font-bold">
                      ${dailyReport?.totalRevenue}
                    </div>
                    <div className="font-light text-xs">
                      <p className=" leading-3">
                        Revenue vs <br />
                        last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center justify-between w-full">
                    <Button variant={"muted"} disabled className="rounded-xl">
                      <CreditCard className="h-4 w-4 text-gray-900" />
                    </Button>
                    {d?.totalSales! >= 0 ? (
                      <Badge className="rounded-full bg-blue-600 hover:bg-blue-600 text-sm">
                        +{d?.totalSales.toFixed(2)}%
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-red-600 hover:bg-red-600 text-sm">
                        {d?.totalSales.toFixed(2)}%
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                  <p className="text-sm">Total Sales</p>
                  <div className="flex items-center gap-x-1">
                    <div className="text-3xl font-bold">
                      {dailyReport?.totalSales}
                    </div>
                    <div className="font-light text-xs">
                      <p className=" leading-3">
                        Sale vs <br />
                        last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center justify-between w-full">
                    <Button variant={"muted"} disabled className="rounded-xl">
                      <Percent className="h-4 w-4 text-gray-900" />
                    </Button>
                    {d?.averageSaleAmount! >= 0 ? (
                      <Badge className="rounded-full bg-blue-600 hover:bg-blue-600 text-sm">
                        +{d?.averageSaleAmount.toFixed(2)}%
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-red-600 hover:bg-red-600 text-sm">
                        {d?.averageSaleAmount.toFixed(2)}%
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                  <p className="text-sm">Average Sale</p>
                  <div className="flex items-center gap-x-1">
                    <div className="text-3xl font-bold">
                      ${dailyReport?.averageSaleAmount}
                    </div>
                    <div className="font-light text-xs">
                      <p className=" leading-3">
                        avg sale vs <br />
                        last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center justify-between w-full">
                    <Button variant={"muted"} disabled className="rounded-xl">
                      <CupSoda className="h-4 w-4 text-gray-900" />
                    </Button>
                    {d?.largestSale! >= 0 ? (
                      <Badge className="rounded-full bg-blue-600 hover:bg-blue-600 text-sm">
                        +{d?.largestSale.toFixed(2)}%
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-red-600 hover:bg-red-600 text-sm">
                        {d?.largestSale.toFixed(2)}%
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                  <p className="text-sm">Drink Sold</p>
                  <div className="flex items-center gap-x-1">
                    <div className="text-3xl font-bold">{monthlyBottle}</div>
                    <div className="font-light text-xs">
                      <p className=" leading-3">
                        sale vs <br />
                        last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
            <div className="col-span-2 xl:col-span-3">
              {/* <SaleChart /> */}
              <SaleRevenueChart />
              {/* <FixedExpensePieChart /> */}
            </div>
            <div className="xl:col-span-2">
              {/* <TopDrinkChart /> */}
              <BottleAmountChart />
            </div>
            <div className="xl:col-span-5"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
