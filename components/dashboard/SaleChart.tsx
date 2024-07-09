"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getSummaries } from "@/actions/saleActions";
import { Skeleton } from "../ui/skeleton";

interface ChartData {
  date: string;
  sales: number;
}

const chartConfig = {
  sales: {
    label: "Total Sales",
    color: "hsl(var(--chart-1))",
  },
} as ChartConfig;

const SaleChart = () => {
  const [data, setData] = useState<ChartData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date("2024-07-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-31"));

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true);
      const response = await getSummaries();

      if (response && Array.isArray(response) && response.length > 0) {
        const transformedData = response.map((summary) => ({
          date: new Date(summary.data).toLocaleDateString("en-US"),
          sales: summary.totalSales,
        }));
        setData(transformedData);
        setStartDate(new Date(response[0].data));
        setEndDate(new Date(response[response.length - 1].data));
      } else {
        console.error("Unexpected response format:", response);
        setData([]);
      }

      setIsLoading(false);
    };

    fetchSummaries();
  }, []);
  return (
    <Card className="h-[650px]">
      <CardHeader>
        <CardTitle>Sale Overview</CardTitle>
        <CardDescription>
          {startDate.toLocaleString("default", { month: "long" })} -{" "}
          {endDate.toLocaleString("default", { month: "long" })}{" "}
          {startDate.getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data!}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="sales" fill="#0565FF" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total sales for the second half of 2024
        </div>
      </CardFooter>
    </Card>
  );
};

export default SaleChart;
