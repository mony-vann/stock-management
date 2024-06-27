"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";

export type StaffColumn = {
  id: number;
  name: string;
  contact_info: string | null;
  role: string;
  shifts: { id: number; name: string; start_time: Date; end_time: Date }[];
  sex: string;
  picture: string;
};

export const columns: ColumnDef<StaffColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "shifts",
    header: "Shift",
    cell: ({ row }) => {
      const { shifts } = row.original;

      return (
        <div>
          {shifts.map((shift: any, index: number) => (
            <Badge key={index} variant={"outline"} className="mr-1">
              {shift.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "contact_info",
    header: "Phone",
  },
  {
    accessorKey: "sex",
    header: "Sex",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
