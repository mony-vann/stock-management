"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getBottles, getDrinkTrendData } from "@/actions/bottleSaleActions"; // Adjust the import path as needed

interface DrinkData {
  date: string;
  quantity: number;
}

interface Bottle {
  itemCode: string;
  itemName: string;
}

const DrinkTrend = () => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);
  const [chartData, setChartData] = useState<DrinkData[]>([]);

  useEffect(() => {
    // Fetch all bottles
    const fetchBottles = async () => {
      try {
        const data = await getBottles();
        setBottles(data);
        if (data.length > 0) {
          setSelectedBottle(data[0].itemCode);
        }
      } catch (error) {
        console.error("Error fetching bottles:", error);
      }
    };
    fetchBottles();
  }, []);

  useEffect(() => {
    // Fetch drink data for selected bottle
    const fetchDrinkData = async () => {
      if (selectedBottle) {
        try {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30); // Last 30 days
          const data = await getDrinkTrendData(
            selectedBottle,
            startDate,
            endDate
          );
          setChartData(data);
        } catch (error) {
          console.error("Error fetching drink trend data:", error);
        }
      }
    };
    fetchDrinkData();
  }, [selectedBottle]);

  const chartConfig: ChartConfig = {
    quantity: {
      label: "Quantity",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <CardTitle>Drink Trend</CardTitle>{" "}
            <Select onValueChange={(value) => setSelectedBottle(value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a bottle" />
              </SelectTrigger>
              <SelectContent className="w-[300px]">
                {bottles.map((bottle) => (
                  <SelectItem key={bottle.itemCode} value={bottle.itemCode}>
                    {bottle.itemName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            Showing total drink for the selected bottle over the last 30 days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 40,
              right: 40,
              top: 20,
              bottom: 20,
            }}
          >
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
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="quantity"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="quantity" fill="#0565FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DrinkTrend;
