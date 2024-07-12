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
import { getAttendanceData } from "@/actions/staffSummaryActions";

const AttendanceTracking = ({
  logs,
  activeStaffs,
  staffs,
  staffWithMostLates,
  staffWithMostEarlyLeaves,
  lastUpdatedTime,
}: any) => {
  const [logss, setLogs] = useState(logs);
  const [activeStaffss, setActiveStaffs] = useState(activeStaffs);
  const [staffss, setStaffs] = useState(staffs);
  const [staffWithMostLatess, setStaffWithMostLatess] =
    useState(staffWithMostLates);
  const [staffWithMostEarlyLeavess, setStaffWithMostEarlyLeaves] = useState(
    staffWithMostEarlyLeaves
  );
  const [lastUpdated, setLastUpdated] = useState(new Date(lastUpdatedTime));

  useEffect(() => {
    console.log(staffWithMostEarlyLeaves);
    const intervalId = setInterval(async () => {
      const {
        recentAttendanceLogs,
        activeStaffs,
        staffWithMostLates,
        staffWithMostEarlyLeaves,
      } = await getAttendanceData();
      setLogs(recentAttendanceLogs);
      setActiveStaffs(activeStaffs);
      setStaffWithMostLatess(staffWithMostLates);
      setStaffWithMostEarlyLeaves(staffWithMostEarlyLeaves);
      setLastUpdated(new Date());
      console.log("Fetching staffs...");

      const staffsResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/employee"
      );

      const latestStaffs = await staffsResponse.json();
      setStaffs(latestStaffs);
    }, 300000); // Fetch every 5 minutes

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <div className="absolute right-10 top-20">
        <h1 className="text-xl font-bold ">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </h1>
      </div>
      <SummaryCards
        totalStaffs={staffss}
        activeStaffs={activeStaffss}
        staffWithMostLates={staffWithMostLatess}
        staffWithMostEarlyLeaves={staffWithMostEarlyLeavess}
      />
      <div className="grid gap-4 md:gap-4 md:grid-cols-3 xl:grid-cols-5 mt-5">
        <div className="xl:col-span-2">
          <Card className="rounded-3xl">
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
                <div className="space-y-2 mx-h-[350px] overflow-y-auto">
                  {activeStaffss.map((staff: any) => (
                    <Alert key={staff.name}>
                      <AlertTitle className="flex items-center justify-between gap-x-2">
                        {staff.name}
                        <Badge className="rounded-md" variant={"outline"}>
                          {staff.role}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        Checked in at {""}
                        {new Date(
                          new Date(staff.timestamp).setHours(-1)
                        ).toLocaleTimeString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 xl:col-span-3 -mt-[245px]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Recent Attendance Logs ({logss.length})</CardTitle>
              <CardDescription>A list of recent logs for today</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[343px] max-h-[620px] overflow-y-auto">
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
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Minutes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logss.map((log: any, index: number) => {
                      return (
                        <TableRow key={log.timestamp}>
                          <TableCell>
                            <div className="font-medium">
                              {log.employeeName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {staffss[index].shift}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="capitalize">{log.type}</p>
                          </TableCell>
                          <TableCell>
                            {log.status === "on-time" ? (
                              <Badge className="capitalize rounded-md hover:bg-primary pointer-events-none">
                                {log.status}
                              </Badge>
                            ) : (
                              <Badge className="capitalize rounded-md bg-red-500 hover:bg-red-500 pointer-events-none">
                                {log.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {log.minutesDiff > 0
                              ? log.minutesDiff > 60
                                ? `${Math.floor(log.minutesDiff / 60)}h ${
                                    log.minutesDiff % 60
                                  }m`
                                : `${log.minutesDiff}m`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {
                              new Date(new Date(log.timestamp).setHours(-1))
                                .toISOString()
                                .split("T")[0]
                            }
                          </TableCell>
                          <TableCell>
                            {new Date(
                              new Date(log.timestamp).setHours(-1)
                            ).toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AttendanceTracking;
