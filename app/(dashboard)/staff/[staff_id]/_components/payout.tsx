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
import { useToast } from "@/components/ui/use-toast";
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
  type: "check-in" | "check-out";
  minutesDifference: number; // Minutes late for check-in or early leave for check-out
  minutesEarlyLeave?: number; // New property for early leave check-out
};

type CheckInMap = {
  [key: number]: {
    status: "check-in" | "permissed" | "absent";
    timestamp?: string;
    lateHours: number;
    earlyLeaveHours: number;
  };
};

type DailyLog = {
  status: "check-in" | "permissed" | "absent";
  date: string;
  lateHours: number;
  earlyLeaveHours: number;
};

type Summary = {
  workingDays: number;
  presentDays: number;
  absences: number;
  permissedAbsences: number;
  earnedSalary: number;
  totalDeduction: number;
  netPay: number;
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

  const { toast } = useToast();
  const [checkinsMap, setCheckinsMap] = useState<CheckInMap>({});
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [summary, setSummary] = useState<Summary>({
    workingDays: 30,
    presentDays: 0,
    absences: 0,
    permissedAbsences: 0,
    earnedSalary: 0,
    totalDeduction: 0,
    netPay: 0,
  });
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [workingDaysPerMonth] = useState(28);
  const [totalDaysInCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  );

  const calculateNetPay = (
    baseSalary: number,
    presentDays: number,
    permittedDays: number,
    checkinsMap: CheckInMap
  ) => {
    const salaryPerDay = baseSalary / workingDaysPerMonth;
    const salaryPerHour = salaryPerDay / 7; // Assuming 7-hour workday

    const earnedSalary = (presentDays + permittedDays) * salaryPerDay;

    const totalLateHours = Object.values(checkinsMap).reduce(
      (total, day) => total + day.lateHours,
      0
    );
    const totalEarlyLeaveHours = Object.values(checkinsMap).reduce(
      (total, day) => total + day.earlyLeaveHours,
      0
    );

    const lateDeduction = totalLateHours * salaryPerHour;
    const earlyLeaveDeduction = totalEarlyLeaveHours * salaryPerHour;

    const totalDeduction = lateDeduction + earlyLeaveDeduction;
    const netPay = earnedSalary - totalDeduction;

    return {
      earnedSalary: parseFloat(earnedSalary.toFixed(2)),
      totalDeduction: parseFloat(totalDeduction.toFixed(2)),
      netPay: parseFloat(netPay.toFixed(2)),
    };
  };

  const updateSummary = (map: CheckInMap) => {
    const presentDays = Object.values(map).filter(
      (day) => day.status === "check-in"
    ).length;
    const permissedDays = Object.values(map).filter(
      (day) => day.status === "permissed"
    ).length;
    const absences = workingDaysPerMonth - presentDays - permissedDays;

    const { earnedSalary, totalDeduction, netPay } = calculateNetPay(
      staff.salary,
      presentDays,
      permissedDays,
      map
    );

    setSummary({
      workingDays: workingDaysPerMonth,
      presentDays,
      absences,
      permissedAbsences: permissedDays,
      earnedSalary,
      totalDeduction,
      netPay,
    });
  };

  const updateLogsAndCheckinsMap = (attendanceLogs: AttendanceLog[]) => {
    const newCheckinsMap: CheckInMap = {};
    const newLogs: DailyLog[] = Array.from(
      { length: workingDaysPerMonth },
      (_, index) => {
        const day = index + 1;
        const date = new Date(
          Number(selectedYear),
          MONTHS.indexOf(selectedMonth),
          day
        );
        const checkInLog = attendanceLogs.find(
          (l) =>
            l.type === "check-in" &&
            new Date(l.timestamp).toDateString() === date.toDateString()
        );
        const checkOutLog = attendanceLogs.find(
          (l) =>
            l.type === "check-out" &&
            new Date(l.timestamp).toDateString() === date.toDateString()
        );

        if (checkInLog || checkOutLog) {
          const lateHours = checkInLog
            ? checkInLog.minutesDifference > 0
              ? checkInLog.minutesDifference / 60
              : 0
            : 0;
          const earlyLeaveHours = checkOutLog
            ? checkOutLog.minutesDifference > 0
              ? checkOutLog.minutesDifference / 60
              : 0
            : 0;
          newCheckinsMap[day] = {
            status: "check-in",
            timestamp: checkInLog?.timestamp || checkOutLog?.timestamp,
            lateHours,
            earlyLeaveHours,
          };
          return {
            status: "check-in",
            date: checkInLog?.timestamp || checkOutLog?.timestamp || "",
            lateHours,
            earlyLeaveHours,
          };
        }
        return {
          status: "absent",
          date: date.toISOString(),
          lateHours: 0,
          earlyLeaveHours: 0,
        };
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
        newMap[day] = { status: "permissed", lateHours: 0, earlyLeaveHours: 0 };
      } else if (newMap[day].status === "permissed") {
        delete newMap[day]; // This effectively sets it to 'absent'
      } else if (newMap[day].status === "check-in") {
        // If it's a real check-in, don't change it
        return prev;
      }

      setLogs((prevLogs) =>
        prevLogs.map((log, index) => {
          if (index === day - 1) {
            return {
              ...log,
              status: newMap[day] ? newMap[day].status : "absent",
            };
          }
          return log;
        })
      );

      updateSummary(newMap);
      return newMap;
    });
  };

  const handleCalculatePayout = async () => {
    const data = {
      id: staff.id,
      logs,
      amount: summary.netPay,
      present_days: summary.presentDays,
      absent_days: summary.absences,
      earned: summary.earnedSalary,
      deductions: summary.totalDeduction,
      permitted_days: summary.permissedAbsences,
      type: "salary",
    };

    try {
      const response = await postPayroll(data);
      if (response) {
        toast({
          title: "Payout successful",
          description: "Payout has been processed successfully",
        });
      } else {
        toast({
          title: "Payout failed",
          description:
            "Payout already exists for the selected month or Not enough data to process payout.",
        });
      }
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
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Payment</DialogTitle>
              <DialogDescription>
                Calculate the payout for the selected month
              </DialogDescription>
            </div>
            <Form {...form}>
              <form>
                <div className="flex items-center gap-x-3 mb-4 mr-10">
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
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-10 mt-5">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Item</TableHead>
                  <TableHead className="font-medium w-[200px]">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Base Salary</TableCell>
                  <TableCell>${staff.salary}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Working Days per Month</TableCell>
                  <TableCell>{workingDaysPerMonth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Present Days</TableCell>
                  <TableCell>{summary.presentDays}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Absences</TableCell>
                  <TableCell>{summary.absences}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Permissed Absences</TableCell>
                  <TableCell>{summary.permissedAbsences}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Earned Salary</TableCell>
                  <TableCell>${summary.earnedSalary}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Deduction</TableCell>
                  <TableCell>${summary.totalDeduction}</TableCell>
                </TableRow>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  <TableCell>Net Pay</TableCell>
                  <TableCell>${summary.netPay}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="">
            {Object.keys(checkinsMap).length === 0 ? (
              <Alert>
                <AlertTitle>No logs found</AlertTitle>
                <AlertDescription>
                  There are no logs found for the selected period.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="h-[500px] relative overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissed</TableHead>
                      <TableHead>Late Hour</TableHead>
                      <TableHead>Early Leave</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(
                      { length: totalDaysInCurrentMonth },
                      (_, i) => i + 1
                    )
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
                            <TableCell className="w-[120px]">
                              {status === "check-in" && (
                                <Badge
                                  variant={"outline"}
                                  className="capitalize"
                                >
                                  check-in
                                </Badge>
                              )}
                              {status === "permissed" && (
                                <Badge className="bg-yellow-400 hover:bg-yellow-700 pointer-events-none capitalize">
                                  permissed
                                </Badge>
                              )}
                              {status === "absent" && (
                                <Badge className="bg-red-600 hover:bg-red-600 pointer-events-none capitalize">
                                  absent
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={
                                  status === "permissed" ||
                                  status === "check-in"
                                }
                                onCheckedChange={() => handleStatusChange(day)}
                                disabled={
                                  checkIn && checkIn.status === "check-in"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {checkIn && checkIn.lateHours > 0
                                ? "$" + checkIn.lateHours.toFixed(2)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {checkIn && checkIn.earlyLeaveHours > 0
                                ? "$" + checkIn.earlyLeaveHours.toFixed(2)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant={"outline"}>Export</Button>
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
