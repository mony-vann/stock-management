"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";
import Link from "next/link";

export type StaffColumn = {
  id: number;
  name: string;
  contact_info: string | null;
  role: string;
  shift: string;
  sex: string;
  picture: string;
};

export const columns: ColumnDef<StaffColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/staff/${row.original.id}`}>{row.original.name}</Link>
      );
    },
  },
  {
    accessorKey: "shifts",
    header: "Shift",
    cell: ({ row }) => {
      return (
        <div>
          <Badge variant={"outline"} className="mr-1">
            {row.original.shift}
          </Badge>
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
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 capitalize"> {row.original.sex} </p>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
