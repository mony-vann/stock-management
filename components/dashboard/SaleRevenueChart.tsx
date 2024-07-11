"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSummaries } from "@/actions/saleActions";
import { getBottleSaleSummary } from "@/actions/bottleSaleActions";

interface SummaryData {
  id: string;
  data: Date;
  totalSales: number;
  totalAmount: number;
  totalSubTotal: number;
  totalVAT: number;
  totalDiscounts: number;
  totalRevenue: number;
  averageSaleAmount: number;
  largestSale: number;
  smallestSale: number;
}

interface BottleSaleSummary {
  date: Date;
  totalQuantity: number;
  totalMargin: number;
}

interface ChartData {
  date: string;
  revenues: number;
  sales: number;
  bottleSales: number;
  fill?: string;
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
  revenues: {
    label: "Revenues",
    color: "hsl(var(--chart-2))",
  },
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  bottleSales: {
    label: "Drinks Sold",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const SaleRevenueChart = () => {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [data, setData] = React.useState<ChartData[] | null>(null);
  const [filteredData, setFilteredData] = React.useState<ChartData[] | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [summariesResponse, bottleSalesResponse] = await Promise.all([
        getSummaries(),
        getBottleSaleSummary(),
      ]);

      if (
        summariesResponse &&
        Array.isArray(summariesResponse) &&
        summariesResponse.length > 0
      ) {
        const transformedData = summariesResponse.map(
          (summary: SummaryData) => {
            const date = new Date(summary.data).toISOString().split("T")[0];
            const bottleSale = bottleSalesResponse.find(
              (bs: BottleSaleSummary) =>
                new Date(bs.date).toISOString().split("T")[0] === date
            );
            return {
              date,
              revenues: summary.totalRevenue,
              sales: summary.totalSales,
              bottleSales: bottleSale ? bottleSale.totalQuantity : 0,
            };
          }
        );
        setData(transformedData);
      } else {
        console.error("Unexpected response format:", summariesResponse);
        setData([]);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (data) {
      const filteredData = data.filter((item) => {
        const date = new Date(item.date);
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") {
          daysToSubtract = 30;
        } else if (timeRange === "7d") {
          daysToSubtract = 7;
        }
        now.setDate(now.getDate() - daysToSubtract);
        return date >= now;
      });

      setFilteredData(filteredData);
    }
  }, [data, timeRange]);

  return (
    <Card className="rounded-3xl md:h-[500px]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Sale, Revenue & Bottle Sales Overview</CardTitle>
          <CardDescription>
            Showing total sale, revenue & bottle sales for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto md:h-[350px] w-full "
        >
          <AreaChart data={filteredData || []}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E76E50" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#E76E50" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#46998B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#46998B" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBottle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0565FF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0565FF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    });
                  }}
                  indicator={"line"}
                />
              }
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillMobile)"
              stroke="#46998B"
              stackId="a"
            />
            <Area
              dataKey="bottleSales"
              type="natural"
              fill="url(#fillBottle)"
              stroke="#0565FF"
              stackId="a"
            />
            <Area
              dataKey="revenues"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#E76E50"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SaleRevenueChart;
