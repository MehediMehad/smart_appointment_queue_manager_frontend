"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createStaff, getAllServices } from "@/actions/staff"; // adjust import path if needed

// We'll use this type for the form (status defaults to "Available")
interface NewStaffForm {
  name: string;
  serviceType: string;
  dailyCapacity: number;
}

const Header = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true);

  const [newStaff, setNewStaff] = useState<NewStaffForm>({
    name: "",
    serviceType: "",
    dailyCapacity: 5,
  });

  // Fetch unique service types on mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const result = await getAllServices(1000);

        if (result.success && Array.isArray(result.data)) {
          // Extract unique requiredStaffType values
          const types = new Set(
            result.data.map((s: any) => s.requiredStaffType).filter(Boolean),
          );
          const typeList = Array.from(types) as string[];

          setServiceTypes(typeList);

          // Set default if we have any
          if (typeList.length > 0) {
            setNewStaff((prev) => ({ ...prev, serviceType: typeList[0] }));
          }
        } else {
          setError(result.message || "Could not load service types");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load service types");
      } finally {
        setServiceTypesLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleAddStaff = async () => {
    if (!newStaff.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!newStaff.serviceType) {
      setError("Please select a service type");
      return;
    }
    if (newStaff.dailyCapacity < 1) {
      setError("Daily capacity must be at least 1");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: newStaff.name.trim(),
        serviceType: newStaff.serviceType,
        dailyCapacity: newStaff.dailyCapacity,
        status: "Available" as const, // default when creating
      };

      const result = await createStaff(payload);

      if (result.success) {
        setSuccess(true);
        // Reset form
        setNewStaff({
          name: "",
          serviceType: serviceTypes[0] || "",
          dailyCapacity: 5,
        });

        // Optional: close dialog after short delay
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError(result.message || "Failed to create staff member");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team and their availability
        </p>
      </div>

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
              Enter details to add a new team member
            </DialogDescription>
          </DialogHeader>

          {serviceTypesLoading ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-5 pt-2">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  Staff member created successfully!
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-1">Name</label>
                <Input
                  placeholder="Dr. John Doe / Nurse Sarah"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Service Type
                </label>
                {serviceTypes.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-2">
                    No service types available
                  </div>
                ) : (
                  <select
                    value={newStaff.serviceType}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, serviceType: e.target.value })
                    }
                    disabled={loading}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Daily Capacity (appointments per day)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newStaff.dailyCapacity}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      dailyCapacity: parseInt(e.target.value) || 1,
                    })
                  }
                  disabled={loading}
                />
              </div>

              <Button
                onClick={handleAddStaff}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Staff Member"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
