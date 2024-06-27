import React, { Suspense } from "react";

import StaffClient from "./_components/client";
import SummaryCards from "./_components/summaryCards";
import AttendanceTracking from "./_components/attendanceTracking";
// import // getAttendanceRecentLogs,
// // getActiveStaffs,
// "@/actions/getAttendanceRecentLogs";

async function getStaff() {
  const staff = await fetch(process.env.API_URL + "/api/employee", {
    cache: "no-store",
  });
  const data = await staff.json();

  return data;
}

async function getAttendanceRecentLogs() {
  const logs = await fetch(process.env.API_URL + "/api/employee/logs", {
    cache: "no-store",
  });
  const data = await logs.json();

  return data;
}

async function getActiveStaffs() {
  const staffs = await fetch(process.env.API_URL + "/api/employee/active", {
    cache: "no-store",
  });
  const data = await staffs.json();

  return data;
}

const StaffPage = async () => {
  const formattedData = await getStaff();
  const attendanceLogs = await getAttendanceRecentLogs();
  const activeStaffs = await getActiveStaffs();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex items-center mx-10 mt-10">
        <div className="pl-14">
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your staff.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="p-4 md:px-6">
          <AttendanceTracking
            logs={attendanceLogs}
            activeStaffs={activeStaffs}
            staffs={formattedData}
          />
          <StaffClient data={formattedData} />
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
