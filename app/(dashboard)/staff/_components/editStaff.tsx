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
    shifts: { id: number; name: string; start_time: Date; end_time: Date }[];
    sex: string;
    picture: string;
  };
  onSaved?: () => void;
}

const FormSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  contact_info: z.string().nonempty().min(8).max(10),
  role: z.string().nonempty(),
  shift: z.string().nonempty(),
  sex: z.string().nonempty(),
  picture: z.string().min(1),
});

const EditStaff = ({ data, onSaved }: EditStaffProps) => {
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      contact_info: data.contact_info!,
      role: data.role,
      shift: data.shifts[0].name,
      sex: data.sex,
      picture: data.picture,
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
    <Dialog modal={false}>
      <DialogTrigger className="flex items-center w-full cursor-pointer">
        <Edit className="w-4 h-4 mr-3" />
        Edit
      </DialogTrigger>
      <DialogContent onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogDescription>Edit information of your staff </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url: string) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
