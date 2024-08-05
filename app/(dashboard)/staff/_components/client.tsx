import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StaffColumn, columns } from "./column";
import AddNewStaff from "./addNewStaff";

interface StaffClientProps {
  data: StaffColumn[];
}

const StaffClient: React.FC<StaffClientProps> = ({ data }) => {
  return (
    <main className="md:grid flex-1 items-start gap-4 sm:py-0 md:gap-8 mt-10">
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staffs List</CardTitle>
            <AddNewStaff />
          </div>
          <CardDescription>
            Manage your staffs and view their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </main>
  );
};

export default StaffClient;
