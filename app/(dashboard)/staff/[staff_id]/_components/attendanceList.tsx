"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MONTHS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAttendanceByIdAndDate } from "@/actions/staffSummaryActions";

const FormSchema = z.object({
  month: z.string().min(1),
  year: z.string().min(4),
});

const AttendanceList = ({ attendance, staffId }: any) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: String(new Date().getFullYear()),
    },
  });

  const [checkinsMap, setCheckinsMap] = useState<{ [key: number]: any }>({});
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );

  const currentDate = new Date();
  const monthLength = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  useEffect(() => {
    updateCheckinsMap(attendance);
  }, [attendance]);

  const updateCheckinsMap = (logs: any) => {
    const checkins = logs.filter((log: any) => log.type === "check-in");
    const newCheckinsMap = checkins.reduce((acc: any, log: any) => {
      const date = new Date(log.timestamp).getDate();
      acc[date] = log;
      return acc;
    }, {});
    setCheckinsMap(newCheckinsMap);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await getAttendanceByIdAndDate(
        staffId,
        data.month,
        data.year
      );
      updateCheckinsMap(response);
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <Card className="md:col-span-2 2xl:col-span-2">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>A list of recent logs the month</CardDescription>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-x-2 py-3 w-full justify-end"
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
                        <SelectTrigger className="w-[180px]">
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
                        <SelectTrigger className="w-[100px]">
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
              <Button type="submit">Find</Button>
            </form>
          </Form>
        </div>
        <CardContent className="h-[500px] overflow-y-scroll">
          {Object.keys(checkinsMap).length === 0 ? (
            <Alert>
              <AlertTitle>No logs found</AlertTitle>
              <AlertDescription>
                There are no logs found for the selected period.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: monthLength }, (_, i) => i + 1)
                  .reverse()
                  .map((day) => {
                    const checkIn = checkinsMap[day];
                    return (
                      <TableRow key={day}>
                        <TableCell>{`${selectedYear}-${(
                          MONTHS.indexOf(selectedMonth) + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${day
                          .toString()
                          .padStart(2, "0")}`}</TableCell>
                        <TableCell>
                          {checkIn ? (
                            <Badge className="rounded-md hover:bg-primary pointer-events-none">
                              check-in
                            </Badge>
                          ) : (
                            <Badge className="rounded-md bg-red-600 hover:bg-red-600 pointer-events-none">
                              absent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {checkIn
                            ? new Date(checkIn.timestamp).toLocaleTimeString()
                            : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default AttendanceList;
