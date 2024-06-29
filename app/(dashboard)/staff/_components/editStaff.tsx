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
import ImageUploader from "@/components/ui/image-uploader";

interface EditStaffProps {
  data: {
    id: number;
    name: string;
    contact_info: string | null;
    role: string;
    shift: string;
    sex: string;
    salary: number;
    // picture: string;
  };
}

const FormSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  contact_info: z.string().min(8).max(10),
  role: z.string().min(1),
  shift: z.string().min(1),
  sex: z.string().min(1),
  salary: z.string().min(1),
  // picture: z.string().min(1),
});

const EditStaff = ({ data }: EditStaffProps) => {
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const dialogRef = useRef<any>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      contact_info: data.contact_info!,
      role: data.role,
      shift: data.shift,
      sex: data.sex,
      salary: String(data.salary),
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
        router.refresh();
        dialogRef.current?.click();
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
        ref={dialogRef}
        className="flex items-center cursor-pointer"
      >
        <Edit className="w-3.5 h-3.5 mr-3" />
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
                  <FormItem className="w-2/3">
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
                name="salary"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Salary</FormLabel>
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
                name="sex"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
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
              <Button
                type="submit"
                className="mr-3"
                disabled={pending}
                onClick={() => onSubmit(form.getValues())}
              >
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
