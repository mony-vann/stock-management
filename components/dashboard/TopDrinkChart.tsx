"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
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

interface ChartData {
  drink: string;
  amount: number;
  fill?: string;
  date?: Date;
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

export function TopDrinkChart() {
  const [data, setData] = useState<ChartData[] | null>(null);
  const [allData, setAllData] = useState<any[] | null>(null); // [1]
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

        const removedSizeData = removeSizeFromDrinks(processedData);
        setData(removedSizeData);

        const dynamicConfig = generateChartConfig(removedSizeData);
        setChartConfig(dynamicConfig);

        const sortedData = [...removedSizeData].sort(
          (a, b) => b.amount - a.amount
        );
        setTopDrinks(sortedData.slice(0, 5).reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSoldDrinks();
  }, []);

  return (
    <Card className="flex flex-col h-[650px]">
      <CardHeader className="pb-0">
        <CardTitle>Top Five Drinks</CardTitle>
        <CardDescription>
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
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <RadialBarChart
            data={topDrinks || []}
            innerRadius={40}
            outerRadius={120}
            startAngle={90}
            endAngle={360}
            barSize={18}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="drink" />}
            />
            <RadialBar dataKey="amount" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {topDrinks?.map((item) => (
          <Alert key={item.drink}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-x-2">
                <div
                  className="mt-[1px]"
                  style={{
                    width: "0.75rem",
                    height: "0.75rem",
                    borderRadius: "0.125rem",
                    backgroundColor: item.fill,
                  }}
                />
                <AlertTitle className="capitalize">{item.drink}</AlertTitle>
              </div>
              <AlertTitle>{item.amount}</AlertTitle>
            </div>
          </Alert>
        ))}
      </CardFooter>
    </Card>
  );
}

export default TopDrinkChart;
