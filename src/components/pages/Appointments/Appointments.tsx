"use client";

import { useState, useEffect } from "react";
import { format, startOfToday, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/layout/Sidebar";
import {
  getAppointments,
  cancelAppointment,
  updateAppointment,
} from "@/actions/appointment";
import { getAllStaffList } from "@/actions/staff";
import { getAllServices } from "@/actions/services";
import Header from "./Header";

// Types
interface Staff {
  id: string;
  name: string;
  dailyCapacity: number;
  currentBookings?: number;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  requiredStaffType: string;
}

interface Appointment {
  id: string;
  customerName: string;
  serviceName: string;
  staffName: string | null;
  dateTime: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "NoShow" | "Waiting";
  timeSlot: { start: string; end: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await getAppointments({
        date: dateStr,
        staffId: selectedStaff || undefined,
        status: selectedStatus || undefined,
      });

      if (res.success) {
        setAppointments(res.data || []);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, selectedStaff, selectedStatus]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getAllStaffList();
        const serviceData = await getAllServices(1, 1000);

        if (data.success) {
          setStaffList(data.data);
        }

        if (serviceData.success) {
          setServices(serviceData.data);
        }
      } catch (err) {
        console.error("Failed to load staff list", err);
      }
    };

    fetchStaff();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    const res = await cancelAppointment(id);
    if (res.success) loadAppointments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      case "NoShow":
        return "bg-red-100 text-red-800";
      case "Waiting":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100";
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string,
  ) => {
    const res = await updateAppointment(appointmentId, { status: newStatus });
    if (res.success) {
      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, status: newStatus as Appointment["status"] }
            : apt,
        ),
      );
    } else {
      alert(res.message || "Failed to update status");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto p-8">
        {/* <Header /> */}
        <Header />

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-end">
          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <div className="">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-60 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    required
                    selected={selectedDate}
                    onSelect={(d: Date) => d && setSelectedDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Staff Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Staff</label>
            <Select
              value={selectedStaff}
              onValueChange={(value) =>
                setSelectedStaff(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staffList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.currentBookings || 0}/{s.dailyCapacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="NoShow">No-Show</SelectItem>
                <SelectItem value="Waiting">Waiting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              {format(selectedDate, "PPP")} — {appointments.length} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : appointments.length === 0 ? (
              <div>No appointments found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Service</th>
                      <th className="text-left py-3 px-4">Staff</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {apt.customerName}
                        </td>
                        <td className="py-3 px-4">{apt.serviceName}</td>
                        <td className="py-3 px-4">{apt.staffName || "—"}</td>
                        <td className="py-3 px-4">
                          {format(parseISO(apt.dateTime), "hh:mm a")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              apt.status,
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <tr key={apt.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Select
                              value={apt.status}
                              onValueChange={(value) =>
                                handleStatusChange(apt.id, value)
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  "w-[120px] text-left text-sm",
                                  getStatusColor(apt.status),
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Scheduled">
                                  Scheduled
                                </SelectItem>
                                <SelectItem value="Completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="Cancelled">
                                  Cancelled
                                </SelectItem>
                                <SelectItem value="NoShow">No-Show</SelectItem>
                                <SelectItem value="Waiting">Waiting</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4 space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            {apt.status === "Scheduled" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancel(apt.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </td>
                        </tr>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
