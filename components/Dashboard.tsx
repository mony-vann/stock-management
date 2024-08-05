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
import DrinkTrend from "./dashboard/DrinkTrend";

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
  const [month, setMonth] = useState<string>("June");
  const [year, setYear] = useState<number>(2024);

  useEffect(() => {
    const fetchDailySales = async () => {
      setIsLoading(true);
      try {
        const response = await getCurrentMonthSalesReport();
        const differences = await getDifferencesPercentagesFromLastMonth();
        const montlyBottleReport = await getCurrentMonthBottleSaleSummary();

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="flex items-center mx-5 pb-10 md:pb-0 md:mx-10 mt-10">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your shop.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-x-10">
            <div>
              <h3 className="text-2xl font-bold text-end">
                {month}, {year}
              </h3>
            </div>
          </div>
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-8">
          {isLoading ? (
            <SummaryCardSkeletons />
          ) : (
            <div className="md:grid space-y-5 md:space-y-0 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
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
                  <p className="text-sm mb-0 lg:mb-2 xl:mb-0">Total Revenue</p>
                  <div className="flex items-center gap-x-3">
                    <div className="text-3xl font-bold gap-x-5 ">
                      ${dailyReport?.totalRevenue?.toFixed(2)}
                      <p className="font-light text-xs md:hidden lg:block xl:hidden">
                        Revenue vs last monthdwa
                      </p>
                    </div>
                    <div className="font-light text-xs hidden md:block lg:hidden xl:block">
                      <p className="leading-3">
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
                  <p className="text-sm mb-0 lg:mb-2 xl:mb-0">
                    Total Recipes (បុង)
                  </p>
                  <div className="flex items-center gap-x-3">
                    <div className="text-3xl font-bold gap-x-5">
                      {dailyReport?.totalSales}
                      <p className="font-light text-xs md:hidden lg:block xl:hidden">
                        Recipes vs last month
                      </p>
                    </div>
                    <div className="font-light text-xs hidden md:block lg:hidden xl:block">
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
                  <p className="text-sm mb-0 lg:mb-2 xl:mb-0">Average Sale</p>
                  <div className="flex items-center gap-x-3">
                    <div className="text-3xl font-bold  gap-x-5">
                      ${dailyReport?.averageSaleAmount?.toFixed(2)}
                      <p className="font-light text-xs md:hidden lg:block xl:hidden">
                        Average sale vs last month
                      </p>
                    </div>
                    <div className="font-light text-xs hidden md:block lg:hidden xl:block">
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
                  <p className="text-sm mb-0 lg:mb-2 xl:mb-0">Drink Sold</p>
                  <div className="flex items-center gap-x-3">
                    <div className="text-3xl font-bold gap-x-5">
                      {monthlyBottle}
                      <p className="font-light text-xs md:hidden lg:block xl:hidden">
                        Drinks sold vs last month
                      </p>
                    </div>
                    <div className="font-light text-xs hidden md:block lg:hidden xl:block">
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
          <div className="md:grid space-y-5 md:space-y-0 gap-4 md:gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <div className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-3">
              <SaleRevenueChart />
            </div>
            <div className="md:col-span-3 lg:col-span-2">
              <BottleAmountChart />
            </div>
            <div className="hidden lg:block xl:hidden col-span-2">
              <FixedExpensePieChart />
            </div>
            <div className="col-span-full">
              <DrinkTrend />
            </div>
            <div className="md:hidden block xl:col-span-5">
              <FixedExpensePieChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
