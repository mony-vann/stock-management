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
import Payout from "./payout";

const Payroll = ({ payrolls, attendance, staff }: any) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isPaid = payrolls.some((payroll: any) => {
    const payrollMonth = new Date(payroll.timestamp).getMonth();
    const payrollYear = new Date(payroll.timestamp).getFullYear();
    return (
      payroll.type === "salary" &&
      payrollMonth === currentMonth &&
      payrollYear === currentYear
    );
  });

  const paymentStatus = isPaid ? "Paid" : "Unpaid";
  return (
    <Card className="md:col-span-3 2xl:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2">
            <CardTitle>Payrolls ({payrolls.length})</CardTitle>
            <Badge className="rounded-md">{paymentStatus}</Badge>
          </div>
          <div>
            <Payout attendance={attendance} staff={staff} />
          </div>
        </div>
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
                    <Badge className="rounded-md hover:bg-primary">
                      {" "}
                      {payroll.type}
                    </Badge>
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
  );
};
export default Payroll;
