"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  LogIn,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface Appointment {
  id: number;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  staffName: string;
  status: string;
}

export default function PublicAppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const appointments: Appointment[] = [
    {
      id: 1,
      customerName: "John Doe",
      serviceName: "General Consultation",
      date: "2026-01-26",
      time: "09:00",
      staffName: "Dr. Riya Sharma",
      status: "SCHEDULED",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      serviceName: "Check-up",
      date: "2026-01-26",
      time: "09:30",
      staffName: "Dr. Riya Sharma",
      status: "SCHEDULED",
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      serviceName: "Nursing Care",
      date: "2026-01-26",
      time: "10:00",
      staffName: "Nurse John",
      status: "SCHEDULED",
    },
    {
      id: 4,
      customerName: "Sarah Wilson",
      serviceName: "General Consultation",
      date: "2026-01-26",
      time: "10:30",
      staffName: "Dr. Sarah Ahmed",
      status: "SCHEDULED",
    },
    {
      id: 5,
      customerName: "Alex Brown",
      serviceName: "Lab Test",
      date: "2026-01-26",
      time: "11:00",
      staffName: "Pending",
      status: "IN_QUEUE",
    },
  ];

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
            {
              href: "/public-dashboard",
              icon: LayoutDashboard,
              label: "Dashboard",
            },
            { href: "/public-staff", icon: Users, label: "Staff" },
            { href: "/public-services", icon: Calendar, label: "Services" },
            {
              href: "/public-appointments",
              icon: Calendar,
              label: "Appointments",
              active: true,
            },
            { href: "/public-queue", icon: Clock, label: "Queue" },
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
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogIn className="w-5 h-5" />
              {sidebarOpen && <span className="ml-2">Login</span>}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              View all scheduled appointments (Read-only)
            </p>
          </div>

          {/* Appointments Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>
                Current appointments and schedule
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
