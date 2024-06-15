"use client";

import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: number;
  name: string;
  status: string;
  amount: number;
  category: {
    name: string;
  };
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description");

      return (
        <div className="truncate w-56 text-muted-foreground">
          {description as React.ReactNode}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return <Badge variant={"outline"}>{status as React.ReactNode}</Badge>;
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
