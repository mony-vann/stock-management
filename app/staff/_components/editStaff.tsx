"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

interface EditStaffProps {
  data: {
    id: number;
    name: string;
    contact_info: string | null;
    role: string;
    shifts: { id: number; name: string; start_time: Date; end_time: Date }[];
  };
  onSaved?: () => void;
}

const FormSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  contact_info: z.string().nonempty().min(8).max(10),
  role: z.string().nonempty(),
  shift: z.string().nonempty(),
});

const EditStaff = ({ data, onSaved }: EditStaffProps) => {
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<any>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      contact_info: data.contact_info!,
      role: data.role,
      shift: data.shifts[0].name,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const editUser = async () => {
      setPending(true);
      try {
        await axios.patch(`/api/employee?id=${data.id}`, data);
        setPending(false);
        toast({
          title: "Employee updated",
          description: "Employee has been updated successfully",
        });
        formRef.current!.click();
        onSaved && onSaved();
        router.refresh();
      } catch (error) {
        console.error("Failed to update employee:", error);
      }
    };

    editUser();
  };

  React.useEffect(() => {
    fetch("/api/shift")
      .then((res) => res.json())
      .then((data) => {
        setShifts(data);
        setLoading(false);
      });
  }, []);

  return (
    <Dialog>
      <DialogTrigger
        ref={formRef}
        className="flex items-center w-full cursor-pointer"
      >
        <Edit className="w-4 h-4 mr-3" />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogDescription>Edit information of your staff </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center gap-x-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_info"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-x-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Shift</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="none" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          shifts?.map((shift: any) => (
                            <SelectItem key={shift.id} value={shift.name}>
                              {shift.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex justify-end">
              <Button type="submit" className="mr-3" disabled={pending}>
                {pending ? "Saving..." : "Edit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaff;
