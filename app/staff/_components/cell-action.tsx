"use client";

import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { StaffColumn } from "./column";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

interface CellActionProps {
  data: StaffColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const onDelete = async (id: number) => {
    try {
      await axios.delete(`/api/employee/${id}`);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Copy product ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`products/${data.id}`)}>
            <Eye className="w-4 h-4 mr-3" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => "/edit"}>
            <Edit className="w-4 h-4 mr-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(data.id)}>
            <Trash className="w-4 h-4 mr-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
