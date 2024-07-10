"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getLatestAmountSoldEachBottle } from "@/actions/bottleSaleActions";
import { randomInt } from "crypto";
import { Alert, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";

interface ChartData {
  drink: string;
  amount: number;
  fill?: string;
  date?: Date;
  percentage?: string;
}

interface ChartItem {
  label: string;
  color?: string;
}

type ChartConfig = {
  amount: ChartItem;
  [key: string]: ChartItem;
};

const baseChartConfig: ChartConfig = {
  amount: {
    label: "Amount",
  },
};

const colorPalette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function generateChartConfig(data: ChartData[]): ChartConfig {
  const dynamicConfig: ChartConfig = { ...baseChartConfig };
  data.forEach((item, index) => {
    dynamicConfig[item.drink] = {
      label: item.drink
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      color: colorPalette[index % colorPalette.length],
    };
  });

  return dynamicConfig;
}

function removeSizeFromDrinks(data: ChartData[]): ChartData[] {
  return data
    .filter((item): item is ChartData => item.drink !== undefined)
    .map((item, index) => ({
      ...item,
      drink: item.drink
        .replace(/ [LS]$/, "")
        .toLowerCase()
        .replace(" ", "_"),
      fill: colorPalette[index % colorPalette.length],
    }));
}

export function BottleAmountChart() {
  const [data, setData] = useState<ChartData[] | null>(null);
  const [topDrinks, setTopDrinks] = useState<ChartData[] | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig>(baseChartConfig);

  useEffect(() => {
    const fetchSoldDrinks = async () => {
      try {
        const response = await getLatestAmountSoldEachBottle();

        const processedData = Object.entries(response).map(
          ([baseCode, sales]) => {
            const totalQuantity = sales.reduce(
              (sum, sale) => sum + sale.quantity,
              0
            );
            const itemName = sales[0].itemDescription;

            return {
              drink: itemName,
              amount: totalQuantity,
              date: sales[0].date,
            };
          }
        );

        // Calculate the total amount of all products
        const totalAmount = processedData.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        // Calculate percentage for each product
        const dataWithPercentage = processedData.map((item) => ({
          ...item,
          percentage: ((item.amount / totalAmount) * 100).toFixed(2),
        }));

        const removedSizeData = removeSizeFromDrinks(dataWithPercentage);
        setData(removedSizeData);

        const dynamicConfig = generateChartConfig(removedSizeData);
        setChartConfig(dynamicConfig);

        const sortedData = [...removedSizeData].sort(
          (a, b) => b.amount - a.amount
        );
        setTopDrinks(sortedData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSoldDrinks();
  }, []);

  return (
    <Card className="flex flex-col h-[500px] rounded-3xl">
      <CardHeader className="pb-0">
        <CardTitle>Top Five Drinks</CardTitle>
        <CardDescription>
          Showing report on{" "}
          {data?.[0]?.date
            ? new Date(data[0].date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-[300px] h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={topDrinks || []}
              dataKey="amount"
              label
              nameKey="drink"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {topDrinks?.map((item) => (
          // <Alert key={item.drink}>
          <div
            className="flex items-center w-full justify-between"
            key={item.drink}
          >
            <div className="flex items-start gap-x-2">
              <div
                className="mt-[3px]"
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "0.125rem",
                  backgroundColor: item.fill,
                }}
              />

              <div className="flex items-center gap-x-2">
                <AlertTitle className="capitalize">
                  {item.drink.replace("_", " ")}
                </AlertTitle>

                <Badge variant={"outline"}>{item.percentage}%</Badge>
              </div>
            </div>
            <AlertTitle>{item.amount}</AlertTitle>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

export default BottleAmountChart;
