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
import { LoaderCircle } from "lucide-react";

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
  const [checkoutsMap, setCheckoutsMap] = useState<{ [key: number]: any }>({});
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [pending, setPending] = useState(false);

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
    const checkOuts = logs.filter((log: any) => log.type === "check-out");
    const newCheckinsMap = checkins.reduce((acc: any, log: any) => {
      const date = new Date(log.timestamp).getUTCDate();
      acc[date] = log;
      return acc;
    }, {});
    const newCheckoutsMap = checkOuts.reduce((acc: any, log: any) => {
      const date = new Date(log.timestamp).getUTCDate();
      acc[date] = log;
      return acc;
    }, {});

    setCheckoutsMap(newCheckoutsMap);
    setCheckinsMap(newCheckinsMap);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setPending(true);
    try {
      const response = await getAttendanceByIdAndDate(
        staffId,
        data.month,
        data.year
      );
      updateCheckinsMap(response);
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
      setPending(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <Card className="col-span-full rounded-3xl">
      <CardHeader>
        <div className="w-full md:flex items-center justify-between">
          <CardTitle className="w-full">Attendance</CardTitle>
          <div className="w-full flex md:justify-end mt-2 md:mt-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-x-2 "
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
                          <SelectTrigger className="w-full">
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
          A list of recent logs the month
        </CardDescription>
      </CardHeader>{" "}
      <CardContent>
        {Object.keys(checkinsMap).length === 0 ? (
          <Alert>
            <AlertTitle>No logs found</AlertTitle>
            <AlertDescription>
              There are no logs found for the selected period.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="h-[750px] relative overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow className="">
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Late Checkin</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Early Checkout</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: monthLength }, (_, i) => i + 1)
                  .reverse()
                  .map((day) => {
                    const checkIn = checkinsMap[day];
                    const checkOut = checkoutsMap[day];
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
                            <Badge
                              variant={"outline"}
                              className="hover:bg-primary pointer-events-none"
                            >
                              Present
                            </Badge>
                          ) : (
                            <Badge className=" bg-red-600 hover:bg-red-600 pointer-events-none">
                              Absent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {checkIn
                            ? new Date(
                                checkIn.timestamp - 7 * 60 * 60 * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : null}
                        </TableCell>
                        <TableCell>
                          {checkOut
                            ? new Date(
                                checkOut.timestamp - 7 * 60 * 60 * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : null}
                        </TableCell>
                        <TableCell>
                          {checkIn
                            ? checkIn.status === "late"
                              ? checkIn.minutesDifference > 60
                                ? `${Math.floor(
                                    checkIn.minutesDifference / 60
                                  )}h ${checkIn.minutesDifference % 60}m`
                                : `${checkIn.minutesDifference}m`
                              : "-"
                            : ""}
                        </TableCell>
                        <TableCell className="w-[250px]">
                          {checkIn ? checkIn.reason : ""}
                        </TableCell>
                        <TableCell>
                          {checkOut
                            ? checkOut.status === "early"
                              ? checkOut.minutesDifference > 60
                                ? `${Math.floor(
                                    checkOut.minutesDifference / 60
                                  )}h ${checkOut.minutesDifference % 60}m`
                                : `${checkOut.minutesDifference}m`
                              : "-"
                            : ""}
                        </TableCell>
                        <TableCell className="w-[250px]">
                          {checkOut ? checkOut.reason : ""}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default AttendanceList;
