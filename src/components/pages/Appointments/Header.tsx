import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
interface Appointment {
  id: number;
  customerName: string;
  serviceId: number;
  serviceName: string;
  date: string;
  time: string;
  staffName: string;
  status: string;
}

const Header = () => {
  const [newAppointment, setNewAppointment] = useState({
    customerName: "",
    serviceId: "1",
    date: "2026-01-26",
    time: "10:00",
  });

  const [conflictAlert, setConflictAlert] = useState(false);

  const handleCreateAppointment = () => {
    if (!newAppointment.customerName.trim()) return;
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Schedule and manage appointments
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> New Appointment
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>
              Schedule a new appointment for a customer
            </DialogDescription>
          </DialogHeader>
          {conflictAlert && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Time Conflict
                </p>
                <p className="text-sm text-red-700">
                  A staff member is already booked at this time.
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                placeholder="Enter customer name"
                value={newAppointment.customerName}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    customerName: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Service</label>
              <select
                value={newAppointment.serviceId}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    serviceId: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              >
                <option value="1">General Consultation</option>
                <option value="2">Check-up</option>
                <option value="3">Nursing Care</option>
                <option value="4">Lab Test</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    date: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    time: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleCreateAppointment}
              className="w-full bg-primary hover:bg-blue-700"
            >
              Create Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
