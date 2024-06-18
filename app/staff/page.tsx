import React from "react";
import { db } from "@/lib/db";

import StaffClient from "./_components/client";
import { StaffColumn } from "./_components/column";

// Fetching data on the server-side
const fetchStaffData = async () => {
  const data = await db.employee.findMany({
    include: {
      shifts: true,
    },
  });

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    contact_info: item.contact_info,
    role: item.role,
    shifts: item.shifts,
  }));
};

const StaffPage = async () => {
  const data = await fetchStaffData();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <StaffClient data={data} />
      </div>
    </div>
  );
};

export default StaffPage;
