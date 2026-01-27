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
import { Plus } from "lucide-react";
import { useState } from "react";
interface Staff {
  id: number;
  name: string;
  serviceType: string;
  dailyCapacity: number;
  todayLoad: string;
  status: string;
}

const Header = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    serviceType: "Doctor",
    dailyCapacity: 5,
  });
  const handleAddStaff = () => {
    if (newStaff.name.trim()) {
      const staff: Staff = {
        id: staffList.length + 1,
        name: newStaff.name,
        serviceType: newStaff.serviceType,
        dailyCapacity: newStaff.dailyCapacity,
        todayLoad: "0/" + newStaff.dailyCapacity,
        status: "AVAILABLE",
      };
      setStaffList([...staffList, staff]);
      setNewStaff({ name: "", serviceType: "Doctor", dailyCapacity: 5 });
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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Staff
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Create a new staff member to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Staff name"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Service Type</label>
              <select
                value={newStaff.serviceType}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    serviceType: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              >
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Technician</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Daily Capacity</label>
              <Input
                type="number"
                value={newStaff.dailyCapacity}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    dailyCapacity: parseInt(e.target.value),
                  })
                }
                className="mt-1"
                min="1"
              />
            </div>
            <Button
              onClick={handleAddStaff}
              className="w-full bg-primary hover:bg-blue-700"
            >
              Create Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
