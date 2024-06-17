import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StaffColumn } from "./column";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type EditStaffProps = {
  data: StaffColumn;
};

const FormSchema = z.object({
  name: z.string().nonempty(),
  contact_info: z.string().nonempty().min(8).max(10),
  role: z.string().nonempty(),
  shift: z
    .string({
      required_error: "Shift is required",
    })
    .nonempty(),
});

const EditStaff = ({ data }: EditStaffProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      contact_info: "",
      role: "",
      shift: "",
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="flex items-center w-full cursor-pointer">
        <Edit className="w-4 h-4 mr-3" />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogDescription>Edit information of your staff </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaff;
