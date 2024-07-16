import React, { Suspense } from "react";

import StaffClient from "./_components/client";
import SummaryCards from "./_components/summaryCards";
import AttendanceTracking from "./_components/attendanceTracking";
import { StaffColumn } from "./_components/column";
import { getAttendanceData } from "@/actions/staffSummaryActions";

async function getStaff() {
  const staff = await fetch(process.env.API_URL + "/api/employee", {
    cache: "no-store",
  });

  const data = await staff.json();

  return data;
}

const StaffPage = async () => {
  const formattedData = await getStaff();
  const {
    recentAttendanceLogs,
    activeStaffs,
    staffWithMostLates,
    staffWithMostEarlyLeaves,
    timeStamp,
  } = await getAttendanceData();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex items-center mx-10 mt-10">
        <div className="md:pl-12">
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground ">
            Overview of your staff.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="p-4 md:px-6">
          <AttendanceTracking
            logs={recentAttendanceLogs}
            activeStaffs={activeStaffs}
            staffs={formattedData}
            staffWithMostLates={staffWithMostLates}
            staffWithMostEarlyLeaves={staffWithMostEarlyLeaves}
            lastUpdatedTime={timeStamp}
          />
          <StaffClient data={formattedData} />
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
