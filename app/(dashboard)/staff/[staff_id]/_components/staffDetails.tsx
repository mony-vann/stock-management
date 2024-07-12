"use client";

import Bar_Chart from "./barchart";
import AttendanceList from "./attendanceList";
import Payroll from "./payroll";

const StaffDetail = ({ payrolls, staff, attendance, shifts }: any) => {
  return (
    <div className="grid gap-4 md:gap-4 md:grid-cols-3 2xl:grid-cols-5 mt-5">
      <AttendanceList attendance={attendance} staffId={staff.id} />
      <Payroll payrolls={payrolls} attendance={attendance} staff={staff} />
      {/* <div className="xl:col-span-5">
        <Bar_Chart
          attendanceLogs={attendance}
          shifts={shifts}
          employeeId={staff.shift}
        />
      </div> */}
    </div>
  );
};

export default StaffDetail;
