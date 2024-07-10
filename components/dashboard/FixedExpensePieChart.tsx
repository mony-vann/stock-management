"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const chartData = [
  { type: "rental", expense: 300, fill: "var(--color-rental)", bg: "#E76E50" },
  { type: "salary", expense: 200, fill: "var(--color-salary)", bg: "#299D90" },
  {
    type: "utility",
    expense: 287,
    fill: "var(--color-utility)",
    bg: "#264753",
  },
  {
    type: "internet",
    expense: 173,
    fill: "var(--color-internet)",
    bg: "#E9C469",
  },
  {
    type: "license",
    expense: 190,
    fill: "var(--color-license)",
    bg: "#F4A462",
  },
];

const chartConfig = {
  expense: {
    label: "Expense",
  },
  rental: {
    label: "Rental",
    color: "hsl(var(--chart-1))",
  },
  salary: {
    label: "Salaries",
    color: "hsl(var(--chart-2))",
  },
  utility: {
    label: "Utilities",
    color: "hsl(var(--chart-3))",
  },
  internet: {
    label: "Wifi",
    color: "hsl(var(--chart-4))",
  },
  license: {
    label: "Licenses",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const FixedExpensePieChart = () => {
  const totalExpense = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.expense, 0);
  }, []);

  return (
    <Card className="flex flex-col h-[500px] rounded-3xl">
      <CardHeader className=" pb-0">
        <CardTitle>Operating Expense</CardTitle>
        <CardDescription>
          Overview of your operating expenses per month.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="expense"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${totalExpense.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {" "}
                          per month
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {chartData.map((item) => (
          <div
            className="flex items-center w-full justify-between"
            key={item.type}
          >
            <div className="flex items-start gap-x-2">
              <div
                className="mt-[1px]"
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "0.125rem",
                  backgroundColor: item.bg,
                }}
              />
              <AlertTitle className="capitalize">{item.type}</AlertTitle>
            </div>
            <AlertTitle>${item.expense}</AlertTitle>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
};

export default FixedExpensePieChart;
