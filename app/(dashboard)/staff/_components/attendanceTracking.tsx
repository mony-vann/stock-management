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
      <div className="hidden md:block absolute right-10 top-20">
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
      <div className="lg:grid gap-4 md:gap-4 md:grid-cols-3 xl:grid-cols-5 mt-10">
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
                    <Alert key={staff.name} className="rounded-xl">
                      <AlertTitle className="flex items-center justify-between gap-x-2">
                        {staff.name}
                        <Badge variant={"outline"}>{staff.role}</Badge>
                      </AlertTitle>
                      <AlertDescription>
                        Checked in at {""}
                        {new Date(
                          staff.timestamp - 7 * 60 * 60 * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 xl:col-span-3 mt-5 lg:mt-0 xl:-mt-[265px]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Recent Attendance Logs ({logss.length})</CardTitle>
              <CardDescription>A list of recent logs for today</CardDescription>
            </CardHeader>
            <CardContent>
              {logss.length === 0 ? (
                <Alert>
                  <AlertTitle>No logs found</AlertTitle>
                  <AlertDescription>
                    There are no logs found for today.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="min-h-[343px] max-h-[620px] relative overflow-auto">
                  <Table>
                    <TableHeader className="top-0 sticky bg-white">
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
                      {logss.map((log: any) => {
                        return (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="font-medium">
                                {log.employeeName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {log.shift || "Shift"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="capitalize whitespace-nowrap">
                                {log.type}
                              </p>
                            </TableCell>
                            <TableCell>
                              {log.status === "on-time" ? (
                                <Badge className="capitalize hover:bg-primary pointer-events-none whitespace-nowrap">
                                  {log.status}
                                </Badge>
                              ) : (
                                <Badge className="capitalize bg-red-500 hover:bg-red-500 pointer-events-none whitespace-nowrap">
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
                                new Date(log.timestamp)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {new Date(
                                log.timestamp - 7 * 60 * 60 * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
        </div>
      </div>
    </>
  );
};

export default AttendanceTracking;
