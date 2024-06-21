import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { StaffColumn, columns } from "./column";
import AddNewStaff from "./addNewStaff";

import { File } from "lucide-react";

interface StaffClientProps {
  data: StaffColumn[];
}

const StaffClient: React.FC<StaffClientProps> = ({ data }) => {
  return (
    <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 mt-10">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <AddNewStaff />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Staffs List</CardTitle>
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
