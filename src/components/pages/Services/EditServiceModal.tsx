"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { updateService } from "@/actions/services";
import { getAllStaff } from "@/actions/staff";
import { IService } from "@/types/service";

interface Props {
  open: boolean;
  onClose: () => void;
  service: IService | null;
  onSuccess: () => void;
}

const EditServiceModal = ({ open, onClose, service, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [staffTypes, setStaffTypes] = useState<{ serviceType: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    requiredStaffType: "",
    durationMinutes: "",
  });

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        requiredStaffType: service.requiredStaffType,
        durationMinutes: String(service.durationMinutes),
      });
    }
  }, [service]);

  useEffect(() => {
    const loadStaffTypes = async () => {
      const res = await getAllStaff();
      if (res.success) setStaffTypes(res.data);
    };
    loadStaffTypes();
  }, []);

  const handleUpdate = async () => {
    if (!service) return;

    setLoading(true);

    const res = await updateService(service.id, {
      name: form.name,
      requiredStaffType: form.requiredStaffType,
      durationMinutes: Number(form.durationMinutes),
    });

    setLoading(false);

    if (res?.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="text-sm font-medium">Service Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Required Staff Type */}
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

          {/* Duration */}
          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationMinutes: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
            />
          </div>

          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Service"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
