import React from "react";

import StaffClient from "./_components/client";

async function getStaff() {
  const staff = await fetch(process.env.API_URL + "/api/employee", {
    cache: "no-store",
  });
  const data = await staff.json();

  return data;
}

const StaffPage = async () => {
  const formattedData = await getStaff();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <StaffClient data={formattedData} />
      </div>
    </div>
  );
};

export default StaffPage;
