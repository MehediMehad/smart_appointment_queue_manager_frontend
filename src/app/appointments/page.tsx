"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  LogOut,
  Menu,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

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

export default function AppointmentsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    customerName: "",
    serviceId: "1",
    date: "2026-01-26",
    time: "10:00",
  });
  const [conflictAlert, setConflictAlert] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");
    if (!loggedIn) {
      router.push("/appointments");
    } else {
      setIsLoggedIn(true);
      setUser(userData ? JSON.parse(userData) : null);
      // Load demo appointments
      setAppointments([
        {
          id: 1,
          customerName: "John Doe",
          serviceId: 1,
          serviceName: "General Consultation",
          date: "2026-01-26",
          time: "09:00",
          staffName: "Dr. Riya Sharma",
          status: "SCHEDULED",
        },
        {
          id: 2,
          customerName: "Jane Smith",
          serviceId: 2,
          serviceName: "Check-up",
          date: "2026-01-26",
          time: "09:30",
          staffName: "Dr. Riya Sharma",
          status: "SCHEDULED",
        },
        {
          id: 3,
          customerName: "Mike Johnson",
          serviceId: 3,
          serviceName: "Nursing Care",
          date: "2026-01-26",
          time: "10:00",
          staffName: "Nurse John",
          status: "SCHEDULED",
        },
        {
          id: 4,
          customerName: "Sarah Wilson",
          serviceId: 1,
          serviceName: "General Consultation",
          date: "2026-01-26",
          time: "10:30",
          staffName: "Dr. Sarah Ahmed",
          status: "SCHEDULED",
        },
        {
          id: 5,
          customerName: "Alex Brown",
          serviceId: 4,
          serviceName: "Lab Test",
          date: "2026-01-26",
          time: "11:00",
          staffName: "Pending",
          status: "IN_QUEUE",
        },
      ]);
    }
  }, [router]);

  const handleCreateAppointment = () => {
    if (!newAppointment.customerName.trim()) return;

    // Simulate conflict check
    const hasConflict = appointments.some(
      (apt) =>
        apt.date === newAppointment.date &&
        apt.time === newAppointment.time &&
        apt.status === "SCHEDULED",
    );

    if (hasConflict) {
      setConflictAlert(true);
      return;
    }

    const appointment: Appointment = {
      id: appointments.length + 1,
      customerName: newAppointment.customerName,
      serviceId: parseInt(newAppointment.serviceId),
      serviceName:
        ["", "General Consultation", "Check-up", "Nursing Care", "Lab Test"][
          parseInt(newAppointment.serviceId)
        ] || "Service",
      date: newAppointment.date,
      time: newAppointment.time,
      staffName: "Dr. Riya Sharma",
      status: "SCHEDULED",
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      customerName: "",
      serviceId: "1",
      date: "2026-01-26",
      time: "10:00",
    });
    setConflictAlert(false);
  };

  const handleCancelAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/");
  };

  //   if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div
            className={`flex items-center gap-2 ${!sidebarOpen && "hidden"}`}
          >
            <div className="bg-sidebar-primary rounded p-2">
              <Calendar className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg">AppointMent</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/staff", icon: Users, label: "Staff" },
            { href: "/services", icon: Calendar, label: "Services" },
            {
              href: "/appointments",
              icon: Calendar,
              label: "Appointments",
              active: true,
            },
            { href: "/queue", icon: Clock, label: "Queue" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className={sidebarOpen ? "" : "hidden"}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Appointments
              </h1>
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

          {/* Appointments Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>
                View and manage all appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Service
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Staff
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">
                          {apt.customerName}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {apt.serviceName}
                        </td>
                        <td className="py-3 px-4">
                          {apt.date} at {apt.time}
                        </td>
                        <td className="py-3 px-4">{apt.staffName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              apt.status === "SCHEDULED"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-red-50"
                            onClick={() => handleCancelAppointment(apt.id)}
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
