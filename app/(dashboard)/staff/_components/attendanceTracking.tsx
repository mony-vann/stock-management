"use client";

import React, { useEffect, useState } from "react";
import SummaryCards from "./summaryCards";
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AttendanceTracking = ({ logs, activeStaffs, staffs }: any) => {
  const [logss, setLogs] = useState(logs);
  const [activeStaffss, setActiveStaffs] = useState(activeStaffs);
  const [staffss, setStaffs] = useState(staffs);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/employee/logs"
      );
      const latestLogs = await response.json();
      setLogs(latestLogs);

      const activeStaffsResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/employee/active"
      );

      const latestActiveStaffs = await activeStaffsResponse.json();
      setActiveStaffs(latestActiveStaffs);

      const staffsResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/employee"
      );

      const latestStaffs = await staffsResponse.json();
      setStaffs(latestStaffs);
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <SummaryCards
        totalStaffs={staffss.length}
        activeStaffs={activeStaffss.length}
        recentLogs={logss.length}
      />
      <div className="grid gap-4 md:gap-4 md:grid-cols-3 xl:grid-cols-5 mt-5">
        <div className="md:col-span-2 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Logs ({logss.length})</CardTitle>
              <CardDescription>A list of recent logs for today</CardDescription>
            </CardHeader>
            <CardContent className="h-[370px] overflow-y-scroll">
              {logss.length === 0 ? (
                <Alert>
                  <AlertTitle>No logs found</AlertTitle>
                  <AlertDescription>
                    There are no logs found for today.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logss.map((log: any) => (
                      <TableRow key={log.timestamp}>
                        <TableCell>{log.employee.name}</TableCell>
                        <TableCell>
                          {log.type === "check-in" ? (
                            <Badge className="rounded-md hover:bg-primary pointer-events-none">
                              {log.type}
                            </Badge>
                          ) : (
                            <Badge className="rounded-md bg-gray-500 hover:bg-gray-500 pointer-events-none">
                              {log.type}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Staffs ({activeStaffss.length})</CardTitle>
              <CardDescription>
                A list of currently active staffs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeStaffss.length === 0 ? (
                <Alert>
                  <AlertTitle>No active staffs</AlertTitle>
                  <AlertDescription>
                    There are no active staffs at the moment.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2 h-[350px] overflow-y-scroll">
                  {activeStaffss.map((staff: any) => (
                    <Alert key={staff.employee.name}>
                      <AlertTitle className="flex items-center justify-between gap-x-2">
                        {staff.employee.name}
                        <Badge className="rounded-md" variant={"outline"}>
                          {staff.employee.role}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        Checked in at {""}
                        {new Date(staff.timestamp).toLocaleTimeString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AttendanceTracking;
