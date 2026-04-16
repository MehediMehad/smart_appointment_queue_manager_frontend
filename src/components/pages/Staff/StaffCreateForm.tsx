"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createStaff, getAllServices } from "@/actions/staff";

const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  serviceType: z.string().min(1, "Please select a service type"),
  dailyCapacity: z
    .number()
    .min(1, "Daily capacity must be at least 1")
    .max(100, "Daily capacity cannot exceed 100"),
});

type TStaffForm = z.infer<typeof staffSchema>;

type Props = {
  onSuccess?: () => void; // ← নতুন prop যোগ করা হয়েছে
};

export default function StaffCreateForm({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true);

  const form = useForm<TStaffForm>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      serviceType: "",
      dailyCapacity: 5,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Fetch service types
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const result = await getAllServices(1000);
        if (result.success && Array.isArray(result.data)) {
          const types = new Set(
            result.data.map((s: any) => s.requiredStaffType).filter(Boolean),
          );
          const typeList = Array.from(types) as string[];

          setServiceTypes(typeList);
          if (typeList.length > 0 && !form.getValues("serviceType")) {
            form.setValue("serviceType", typeList[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load service types:", err);
        toast.error("Failed to load service types");
      } finally {
        setServiceTypesLoading(false);
      }
    };

    fetchServiceTypes();
  }, [form]);

  const onSubmit = async (values: TStaffForm) => {
    try {
      const payload = {
        name: values.name.trim(),
        serviceType: values.serviceType,
        dailyCapacity: values.dailyCapacity,
        status: "Available" as const,
      };

      const result = await createStaff(payload);

      if (result.success) {
        toast.success("Staff member created successfully!");

        // Reset form
        form.reset();

        // Close modal
        setOpen(false);

        // ✅ Important: Call parent refresh function
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to create staff");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Enter details to add a new team member to your staff.
          </DialogDescription>
        </DialogHeader>

        {serviceTypesLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dr. John Doe or Nurse Sarah"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Type */}
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.length > 0 ? (
                          serviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No service types available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Daily Capacity */}
              <FormField
                control={form.control}
                name="dailyCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Capacity (Appointments per day)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Staff...
                  </>
                ) : (
                  "Create Staff Member"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
