"use client";
import { getSummaries } from "@/actions/saleActions";
import { BarChart, Card, Divider, Switch } from "@tremor/react";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

interface Data {
  date: string;
  "This Year": number;
  "Last Year": number;
}

function valueFormatter(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(number);
}

export default function Bar_Chart() {
  const [showComparison, setShowComparison] = useState(false);
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true);
      const response = await getSummaries();

      setData(
        response.map((summary) => ({
          date: new Date(summary.data).toLocaleDateString("en-US"),
          "This Year": summary.totalSales,
          "Last Year": 0,
        }))
      );
      setIsLoading(false);
    };

    fetchSummaries();
  }, []);

  return (
    <>
      {isLoading ? (
        <Card>
          <Skeleton className="w-full h-40" />
        </Card>
      ) : (
        <Card className="sm:mx-auto">
          <h1 className="text-2xl font-semibold leading-none tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Sales overview
          </h1>
          <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Overview of your sales performance.
          </p>
          <BarChart
            data={data}
            index="date"
            categories={
              showComparison ? ["Last Year", "This Year"] : ["This Year"]
            }
            colors={showComparison ? ["cyan", "blue"] : ["blue"]}
            valueFormatter={valueFormatter}
            yAxisWidth={45}
            className="mt-6 hidden h-80 sm:block"
          />
          <BarChart
            data={data}
            index="date"
            categories={
              showComparison ? ["Last Year", "This Year"] : ["This Year"]
            }
            colors={showComparison ? ["cyan", "blue"] : ["blue"]}
            valueFormatter={valueFormatter}
            showYAxis={false}
            className="mt-4 h-56 sm:hidden"
          />
          <Divider />
          <div className="mb-2 flex items-center space-x-3">
            <Switch
              id="comparison"
              onChange={() => setShowComparison(!showComparison)}
            />
            <label
              htmlFor="comparison"
              className="text-tremor-default text-tremor-content dark:text-dark-tremor-content"
            >
              Show same period last year
            </label>
          </div>
        </Card>
      )}
    </>
  );
}
