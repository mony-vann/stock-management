"use client";
import { BarChart, Card } from "@tremor/react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardDescription, CardTitle } from "@/components/ui/card";

// Define interfaces for the data structures
interface AttendanceLog {
  timestamp: string;
  type: "check-in" | "check-out";
}

interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
}

interface GroupedLogs {
  date: string;
  "Late Check-ins": number;
  "Early Check-outs": number;
}

type MonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

// Utility function to group logs by date within a month
const groupLogsByDate = (
  logs: AttendanceLog[],
  shifts: Shift[],
  employeeId: string,
  selectedMonth: MonthName
): GroupedLogs[] => {
  const grouped = logs.reduce<
    Record<string, { "Late Check-ins": number; "Early Check-outs": number }>
  >((acc, log) => {
    const logDate = new Date(log.timestamp);
    const logMonth = logDate.toLocaleString("default", {
      month: "long",
    }) as MonthName;
    const date = logDate.toLocaleDateString();

    if (logMonth !== selectedMonth) return acc;

    const shift = shifts.find((shift) => shift.id === employeeId);

    if (shift) {
      const checkInTime = new Date(shift.start_time).getTime();
      const checkOutTime = new Date(shift.end_time).getTime();
      const logTime = logDate.getTime();

      if (!acc[date]) {
        acc[date] = { "Late Check-ins": 0, "Early Check-outs": 0 };
      }

      if (log.type === "check-in" && logTime > checkInTime) {
        acc[date]["Late Check-ins"] += 1;
      } else if (log.type === "check-out" && logTime < checkOutTime) {
        acc[date]["Early Check-outs"] += 1;
      }
    }

    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([date, counts]) => ({
      date,
      ...counts,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reverse();
};

// React component props interface
interface BarChartProps {
  attendanceLogs: AttendanceLog[];
  shifts: Shift[];
  employeeId: string;
}

export default function Bar_Chart({
  attendanceLogs,
  shifts,
  employeeId,
}: BarChartProps) {
  const [chartData, setChartData] = useState<GroupedLogs[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthName>(
    new Date().toLocaleString("default", { month: "long" }) as MonthName
  );

  const months: MonthName[] = [
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

  useEffect(() => {
    const data = groupLogsByDate(
      attendanceLogs,
      shifts,
      employeeId,
      selectedMonth
    );
    setChartData(data);
  }, [attendanceLogs, shifts, employeeId, selectedMonth]);

  return (
    <Card className="sm:mx-auto">
      <div className="flex items-center justify-between w-full">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Attendance Overview
        </CardTitle>
        <Select
          defaultValue={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value as MonthName)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CardDescription className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        Number of late check-ins and early check-outs per day.
      </CardDescription>

      <BarChart
        data={chartData}
        index="date"
        categories={["Late Check-ins", "Early Check-outs"]}
        colors={["orange", "purple"]}
        valueFormatter={(v: number) => `${v}`}
        className="mt-6 h-80"
      />
    </Card>
  );
}
