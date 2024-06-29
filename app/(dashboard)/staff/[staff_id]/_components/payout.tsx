import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MONTHS } from "@/lib/constants";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { postPayroll } from "@/actions/payrollActions";

// Define types
type AttendanceLog = {
  timestamp: string;
  type: string;
};

type CheckInMap = {
  [key: number]: {
    status: "check-in" | "permissed" | "absent";
    timestamp?: string;
  };
};

type DailyLog = {
  status: "check-in" | "permissed" | "absent";
  date: string;
};

type Summary = {
  workingDays: number;
  presentDays: number;
  absences: number;
  permissedAbsences: number;
};

const FormSchema = z.object({
  month: z.string().min(1),
  year: z.string().min(4),
});

type FormData = z.infer<typeof FormSchema>;

type PayoutProps = {
  attendance: AttendanceLog[];
  staff: any;
};

const Payout: React.FC<PayoutProps> = ({ attendance, staff }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: String(new Date().getFullYear()),
    },
  });

  const [checkinsMap, setCheckinsMap] = useState<CheckInMap>({});
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [summary, setSummary] = useState<Summary>({
    workingDays: 0,
    presentDays: 0,
    absences: 0,
    permissedAbsences: 0,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const monthLength = new Date(
    Number(selectedYear),
    MONTHS.indexOf(selectedMonth) + 1,
    0
  ).getDate();

  const updateSummary = (map: CheckInMap) => {
    const presentDays = Object.values(map).filter(
      (day) => day.status === "check-in"
    ).length;
    const permissedDays = Object.values(map).filter(
      (day) => day.status === "permissed"
    ).length;
    const absences = monthLength - presentDays - permissedDays;
    setSummary({
      workingDays: monthLength,
      presentDays,
      absences,
      permissedAbsences: permissedDays,
    });
  };

  const updateLogsAndCheckinsMap = (attendanceLogs: AttendanceLog[]) => {
    const newCheckinsMap: CheckInMap = {};
    const newLogs: DailyLog[] = Array.from(
      { length: monthLength },
      (_, index) => {
        const day = index + 1;
        const date = new Date(
          Number(selectedYear),
          MONTHS.indexOf(selectedMonth),
          day
        );
        const log = attendanceLogs.find(
          (l) => new Date(l.timestamp).toDateString() === date.toDateString()
        );

        if (log) {
          newCheckinsMap[day] = {
            status: "check-in",
            timestamp: log.timestamp,
          };
          return { status: "check-in", date: log.timestamp };
        }
        return { status: "absent", date: date.toISOString() };
      }
    );

    setCheckinsMap(newCheckinsMap);
    setLogs(newLogs);
    updateSummary(newCheckinsMap);
  };

  useEffect(() => {
    const filteredAttendance = attendance.filter(
      (log) =>
        new Date(log.timestamp).getMonth() === MONTHS.indexOf(selectedMonth) &&
        new Date(log.timestamp).getFullYear() === Number(selectedYear)
    );
    updateLogsAndCheckinsMap(filteredAttendance);
  }, [selectedMonth, selectedYear, attendance]);

  const handleStatusChange = (day: number) => {
    setCheckinsMap((prev) => {
      const newMap = { ...prev };
      if (!newMap[day] || newMap[day].status === "absent") {
        newMap[day] = { status: "permissed" };
      } else if (newMap[day].status === "permissed") {
        delete newMap[day]; // This effectively sets it to 'absent'
      } else if (newMap[day].status === "check-in") {
        // If it's a real check-in, don't change it
        return prev;
      }

      // Update logs
      setLogs((prevLogs) =>
        prevLogs.map((log) => {
          //   if (log.day === day) {
          return {
            ...log,
            status: newMap[day] ? newMap[day].status : "absent",
          };
          //   }
          return log;
        })
      );

      updateSummary(newMap);
      return newMap;
    });
    setHasChanges(true);
  };

  const handleCalculatePayout = async () => {
    const data = {
      id: staff.id,
      logs,
      amount: staff.salary,
      present_days: summary.presentDays,
      absent_days: summary.absences,
      permitted_days: summary.permissedAbsences,
      type: "salary",
    };

    try {
      const response = await postPayroll(data);
      console.log(response);
    } catch (error) {
      console.error("Error creating payroll:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center bg-primary text-white px-3 py-2 rounded-lg">
        Pay
        <MoveRight size={20} className="ml-2" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Manage attendance and calculate payout
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form>
            <div className="flex items-center gap-x-3 mb-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem className="w-2/4">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedMonth(value);
                      }}
                      value={field.value}
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
                  <FormItem className="w-1/2">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedYear(value);
                      }}
                      value={field.value}
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
            </div>
          </form>
        </Form>

        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>Working Days: {summary.workingDays}</p>
          <p>Present Days: {summary.presentDays}</p>
          <p>Absences: {summary.absences}</p>
          <p>Permissed Absences: {summary.permissedAbsences}</p>
          <p>Salary: {staff.salary}</p>
        </div>

        <div className="max-h-[400px] overflow-y-scroll">
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
                  <TableHead>Permissed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: monthLength }, (_, i) => i + 1)
                  .reverse()
                  .map((day) => {
                    const checkIn = checkinsMap[day];
                    const status = checkIn ? checkIn.status : "absent";
                    return (
                      <TableRow key={day}>
                        <TableCell>{`${selectedYear}-${(
                          MONTHS.indexOf(selectedMonth) + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${day
                          .toString()
                          .padStart(2, "0")}`}</TableCell>
                        <TableCell className="w-[200px]">
                          {status === "check-in" && (
                            <Badge className="rounded-md bg-primary hover:bg-green-primary pointer-events-none">
                              check-in
                            </Badge>
                          )}
                          {status === "permissed" && (
                            <Badge className="rounded-md bg-yellow-400 hover:bg-yellow-700 pointer-events-none">
                              permissed
                            </Badge>
                          )}
                          {status === "absent" && (
                            <Badge className="rounded-md bg-red-600 hover:bg-red-600 pointer-events-none">
                              absent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={
                              status === "permissed" || status === "check-in"
                            }
                            onCheckedChange={() => handleStatusChange(day)}
                            disabled={checkIn && checkIn.status === "check-in"}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleCalculatePayout}
            className="bg-primary hover:bg-primary-700"
          >
            Pay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Payout;
