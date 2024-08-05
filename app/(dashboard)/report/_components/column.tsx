"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ReportColumn = {
  date: Date;
  sales: number;
  drinks: number;
  revenue: number;
};

export const columns: ColumnDef<ReportColumn>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <span>
          {new Date(row.original.date)
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            .replace(/(\d+)(st|nd|rd|th)/, "$1<sup>$2</sup>")}
        </span>
      );
    },
  },
  {
    accessorKey: "drinks",
    header: "Drinks",
  },
  {
    accessorKey: "sales",
    header: "Sales",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => {
      return <span>${row.original.revenue.toFixed(2)}</span>;
    },
  },
  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       return <CellAction data={row.original} />;
  //     },
  //   },
];
