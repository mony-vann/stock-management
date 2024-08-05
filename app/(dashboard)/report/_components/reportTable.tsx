"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import { columns, ReportColumn } from "./column";

import { DollarSign, LoaderCircle } from "lucide-react";
import { getReports } from "@/actions/reportActions";
import { Badge } from "@/components/ui/badge";

interface ReportTableProps {
  reports: ReportColumn[];
}

const FormSchema = z.object({
  month: z.string().min(1),
  year: z.string().min(4),
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: String(new Date().getFullYear()),
    },
  });

  const [pending, setPending] = useState(false);
  const [data, setData] = useState<ReportColumn[]>([]);
  const [total, setTotal] = useState<ReportColumn>();

  useEffect(() => {
    setTotal({
      date: new Date(),
      drinks: reports.reduce((acc, report) => acc + report.drinks, 0),
      sales: reports.reduce((acc, report) => acc + report.sales, 0),
      revenue: reports.reduce((acc, report) => acc + report.revenue, 0),
    });
    setData(reports);
  }, [reports]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setPending(true);
    try {
      const response = await getReports(data.month, data.year);
      setData(response);
      setTotal({
        date: new Date(),
        drinks: response.reduce((acc, report) => acc + report.drinks, 0),
        sales: response.reduce((acc, report) => acc + report.sales, 0),
        revenue: response.reduce((acc, report) => acc + report.revenue, 0),
      });
      setPending(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <div className="w-full md:flex items-center justify-between">
          <CardTitle className="w-full">Report List</CardTitle>
          <div className="w-full flex md:justify-end mt-2 md:mt-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-x-2 w-full md:w-fit"
              >
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[130px] md:w-full">
                            <SelectValue placeholder="month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MONTHS.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-[100px]">
                          {Array.from(
                            { length: 2030 - 2024 + 1 },
                            (_, i) => i + 2024
                          ).map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={pending}>
                  {pending ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <CardDescription className="hidden md:block">
          List of reports for the selected month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="md:grid grid-cols-3 gap-x-4 space-y-4 md:space-y-0">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Total revenue for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-x-3">
                <div className="text-3xl font-bold gap-x-5 ">
                  ${total && total.revenue.toFixed(2)}
                  <p className="font-light text-xs md:hidden lg:block xl:hidden">
                    Revenue for the month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Total Sale (បុង)</CardTitle>
              <CardDescription>Total sale for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-x-3">
                <div className="text-3xl font-bold gap-x-5 ">
                  {total && total.sales.toFixed(0)}
                  <p className="font-light text-xs md:hidden lg:block xl:hidden">
                    Sale for the month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Total Drinks</CardTitle>
              <CardDescription>Total drinks for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-x-3">
                <div className="text-3xl font-bold gap-x-5 ">
                  {total && total.drinks.toFixed(0)}
                  <p className="font-light text-xs md:hidden lg:block xl:hidden">
                    Drink for the month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DataTable columns={columns} data={data} searchBox={false} />
      </CardContent>
    </Card>
  );
};

export default ReportTable;
