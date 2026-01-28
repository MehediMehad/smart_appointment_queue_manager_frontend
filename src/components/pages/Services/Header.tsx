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
import { createService } from "@/actions/services";
import { useEffect, useState } from "react";
import { getAllStaff } from "@/actions/staff";
const Header = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffTypes, setStaffTypes] = useState<{ serviceType: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    requiredStaffType: "",
    durationMinutes: "",
  });

  const handleCreateService = async () => {
    if (!form.name.trim()) return;

    setLoading(true);

    const res = await createService({
      name: form.name,
      requiredStaffType: form.requiredStaffType,
      durationMinutes: Number(form.durationMinutes),
      status: "Available",
    });

    setLoading(false);

    if (res?.success) {
      // reset form
      setForm({
        name: "",
        requiredStaffType: "",
        durationMinutes: "",
      });

      // close modal
      setOpen(false);
    }
  };

  useEffect(() => {
    const loadStaffTypes = async () => {
      const res = await getAllStaff();
      console.log("🟢 Staff Types:", res.data);
      if (res.success) setStaffTypes(res.data);
    };
    loadStaffTypes();
  }, []);

  return (
    <div className="mb-8 flex items-center justify-between px-8 pt-5">
      <div>
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">
          Manage available services and durations
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new service offering</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Service Name */}
            <div>
              <label className="text-sm font-medium">Service Name</label>
              <Input
                placeholder="e.g. Consultation"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Staff Type */}
            <div>
              <label className="text-sm font-medium">Required Staff Type</label>
              <select
                value={form.requiredStaffType}
                onChange={(e) =>
                  setForm({ ...form, requiredStaffType: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="">Select Staff Type</option>
                {staffTypes.map((type) => (
                  <option key={type.serviceType} value={type.serviceType}>
                    {type.serviceType}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Capacity */}
            <div>
              <label className="text-sm font-medium">Duration </label>
              <Input
                placeholder="e.g. 10"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationMinutes: e.target.value.replace(/[^0-9]/g, ""),
                  })
                }
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleCreateService}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
