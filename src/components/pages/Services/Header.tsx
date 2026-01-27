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
interface Service {
  id: number;
  name: string;
  duration: number;
  requiredStaffType: string;
}

const Header = () => {
  const [newService, setNewService] = useState({
    name: "",
    duration: 30,
    requiredStaffType: "Doctor",
  });
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddService = () => {
    if (newService.name.trim()) {
      const service: Service = {
        id: services.length + 1,
        name: newService.name,
        duration: newService.duration,
        requiredStaffType: newService.requiredStaffType,
      };
      setServices([...services, service]);
      setNewService({
        name: "",
        duration: 30,
        requiredStaffType: "Doctor",
      });
    }
  };

  return (
    <div className="mb-8 flex items-center justify-between px-8 pt-5">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground">
          Manage available services and durations
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new service offering</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Service Name</label>
              <Input
                placeholder="e.g., General Consultation"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={newService.duration}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    duration: parseInt(e.target.value),
                  })
                }
                className="mt-1"
                min="5"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Required Staff Type</label>
              <select
                value={newService.requiredStaffType}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    requiredStaffType: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              >
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Technician</option>
              </select>
            </div>
            <Button
              onClick={handleAddService}
              className="w-full bg-primary hover:bg-blue-700"
            >
              Create Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
