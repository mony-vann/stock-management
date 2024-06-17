import React from "react";
import { db } from "@/lib/db";

import StaffClient from "./_components/client";
import { StaffColumn } from "./_components/column";

const StaffPage = async () => {
  const data = await db.employee.findMany({
    include: {
      shifts: true,
    },
  });

  const formattedData: StaffColumn[] = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      contact_info: item.contact_info,
      shifts: item.shifts,
    };
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <StaffClient data={formattedData} />
      </div>
    </div>
  );
};

export default StaffPage;
