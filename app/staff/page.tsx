"use client";

import React, { useState, useEffect } from "react";
import StaffClient from "./_components/client";
import axios from "axios";

const StaffPage = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch staff data on component mount and whenever it changes
  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      const response = await axios.get("/api/employee");

      if (response.status === 200) {
        setStaffData(response.data);
      }

      setLoading(false);
    };

    fetchStaffData();

    // Set up an interval to fetch data periodically (e.g., every 5 seconds)
    const interval = setInterval(fetchStaffData, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <StaffClient data={staffData} loading={loading} />
      </div>
    </div>
  );
};

export default StaffPage;
