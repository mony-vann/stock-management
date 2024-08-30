"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
import { exportEmployeeCurrentMonthAttandence } from "@/actions/employeeActions";

const FormSchema = z.object({
  month: z.string().min(1),
  year: z.string().min(4),
});

const AttendanceList = ({ attendance, staffId, staff }: any) => {
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
    updateCheckinsMap([]);
  }, []);

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

  const calculateWorkingHours = (checkIn: any, checkOut: any) => {
    if (!checkIn || !checkOut) return "00:00";
    const checkInTime = new Date(checkIn.timestamp);
    const checkOutTime = new Date(checkOut.timestamp);
    const diffInMilliseconds = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDataForExport = () => {
    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalWorkingHours = 0;

    const data = Array.from({ length: monthLength }, (_, i) => i + 1).map(
      (day) => {
        const checkIn = checkinsMap[day];
        const checkOut = checkoutsMap[day];
        const date = `${selectedYear}-${(MONTHS.indexOf(selectedMonth) + 1)
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        const status = checkIn
          ? "Present"
          : new Date().getDate() > day
          ? "Absent"
          : "Upcoming";

        if (status === "Present") totalPresentDays++;
        if (status === "Absent") totalAbsentDays++;

        const workingHours = calculateWorkingHours(checkIn, checkOut);
        const [hours, minutes] = workingHours.split(":").map(Number);
        totalWorkingHours += hours + minutes / 60;

        return {
          Date: date,
          Status: status,
          "Time In": checkIn
            ? new Date(
                checkIn.timestamp - 7 * 60 * 60 * 1000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          "Time Out": checkOut
            ? new Date(
                checkOut.timestamp - 7 * 60 * 60 * 1000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          "Working Hours": workingHours,
          "Late Check-in":
            checkIn && checkIn.status === "late"
              ? checkIn.minutesDifference > 60
                ? `${Math.floor(checkIn.minutesDifference / 60)}h ${
                    checkIn.minutesDifference % 60
                  }m`
                : `${checkIn.minutesDifference}m`
              : "",
          "Late Check-in Reason": checkIn ? checkIn.reason : "",
          "Early Check-out":
            checkOut && checkOut.status === "early"
              ? checkOut.minutesDifference > 60
                ? `${Math.floor(checkOut.minutesDifference / 60)}h ${
                    checkOut.minutesDifference % 60
                  }m`
                : `${checkOut.minutesDifference}m`
              : "",
          "Early Check-out Reason": checkOut ? checkOut.reason : "",
        };
      }
    );

    // Format total working hours
    const totalHours = Math.floor(totalWorkingHours);
    const totalMinutes = Math.round((totalWorkingHours - totalHours) * 60);
    const formattedTotalWorkingHours = `${totalHours
      .toString()
      .padStart(2, "0")}:${totalMinutes.toString().padStart(2, "0")}`;

    // Add summary rows
    data.push({
      Date: "Summary",
      Status: "",
      "Time In": "",
      "Time Out": "",
      "Working Hours": "",
      "Late Check-in": "",
      "Late Check-in Reason": "",
      "Early Check-out": "",
      "Early Check-out Reason": "",
    });
    data.push({
      Date: "Total Present Days",
      Status: String(totalPresentDays),
      "Time In": "",
      "Time Out": "",
      "Working Hours": "",
      "Late Check-in": "",
      "Late Check-in Reason": "",
      "Early Check-out": "",
      "Early Check-out Reason": "",
    });
    data.push({
      Date: "Total Absent Days",
      Status: String(totalAbsentDays),
      "Time In": "",
      "Time Out": "",
      "Working Hours": "",
      "Late Check-in": "",
      "Late Check-in Reason": "",
      "Early Check-out": "",
      "Early Check-out Reason": "",
    });
    data.push({
      Date: "Total Working Hours",
      Status: "",
      "Time In": "",
      "Time Out": "",
      "Working Hours": formattedTotalWorkingHours,
      "Late Check-in": "",
      "Late Check-in Reason": "",
      "Early Check-out": "",
      "Early Check-out Reason": "",
    });

    return data;
  };

  const onExport = async () => {
    setPending(true);
    try {
      await exportEmployeeCurrentMonthAttandence(
        staff.name,
        formatDataForExport(),
        selectedMonth,
        selectedYear
      );

      setPending(false);
    } catch (error) {
      // console.error("Error exporting attendance:", error);
      setPending(false);
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
          <Button className="ml-2" onClick={onExport}>
            Export
          </Button>
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
                              className="hover:bg-primary bg-primary text-white pointer-events-none"
                            >
                              Present
                            </Badge>
                          ) : new Date().getDate() > day ? (
                            <Badge
                              variant={"outline"}
                              className="hover:bg-red-600 bg-red-600 text-white pointer-events-none"
                            >
                              Absent
                            </Badge>
                          ) : (
                            <Badge
                              variant={"outline"}
                              className="hover:bg-yellow-400 pointer-events-none"
                            >
                              Upcoming
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
