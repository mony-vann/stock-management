"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import Bar_Chart from "./barchart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AttendanceList from "./attendanceList";

const StaffDetail = ({ payrolls, staff, attendance, shifts }: any) => {
  return (
    <div className="grid gap-4 md:gap-4 md:grid-cols-3 2xl:grid-cols-5 mt-5">
      <AttendanceList attendance={attendance} staffId={staff.id} />
      <Card className="md:col-span-3 2xl:col-span-2">
        <CardHeader>
          <CardTitle>Payrolls ({payrolls.length})</CardTitle>
          <CardDescription>A list of payments</CardDescription>
        </CardHeader>
        <CardContent className="h-[370px] overflow-y-scroll">
          {payrolls.length === 0 ? (
            <Alert>
              <AlertTitle>No payment found</AlertTitle>
              <AlertDescription>
                There are no payment for this staff.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll: any) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="capitalize">
                      <Badge className="rounded-md"> {payroll.type}</Badge>
                    </TableCell>
                    <TableCell>{payroll.amount}</TableCell>
                    <TableCell>
                      {new Date(payroll.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="xl:col-span-5">
        <Bar_Chart
          attendanceLogs={attendance}
          shifts={shifts}
          employeeId={staff.shift}
        />
      </div>
    </div>
  );
};

export default StaffDetail;
