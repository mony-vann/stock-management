"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddNewStaff from "./_components/addNewStaff";
import { DataTable } from "@/components/ui/data-table";
import { StaffColumn, columns } from "./_components/column";

type Props = {};

const StaffPage = (props: Props) => {
  const [employees, setEmployees] = useState<StaffColumn[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/employee");
      setEmployees(response.data);
      loading && setLoading(false);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRefetch = () => {
    fetchEmployees();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <AddNewStaff onAdd={handleRefetch} />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Staffs</CardTitle>
              <CardDescription>
                Manage your staffs and view their performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={employees as StaffColumn[]}
                loading={loading}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
