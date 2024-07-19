"use client";

import AttendanceList from "./attendanceList";
import Payroll from "./payroll";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pfp from "@/public/pfp.jpeg";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const StaffDetail = ({ payrolls, staff, attendance, shifts }: any) => {
  return (
    <div className="md:grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5 space-y-4 md:space-y-0">
      <Card className="w-full bg-cover bg-center rounded-3xl overflow-hidden ">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={Pfp.src} alt="Profile Picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h3 className="text-xl font-semibold">
                {staff?.name || "Fullname"}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                {staff?.role || "Role"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-5 grid gap-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell className=" capitalize">
                  {staff?.sex || "Gender"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Salary</TableCell>
                <TableCell>${staff.salary || "$0"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shift</TableCell>
                <TableCell>
                  {shifts?.map((shift: any) => {
                    if (shift.id === staff.shift) {
                      return shift.name;
                    }
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Phone</TableCell>
                <TableCell>{staff?.contact_info || "01234567"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Payroll payrolls={payrolls} attendance={attendance} staff={staff} />
      <AttendanceList attendance={attendance} staffId={staff.id} />
    </div>
  );
};

export default StaffDetail;
