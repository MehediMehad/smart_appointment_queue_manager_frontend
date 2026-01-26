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
  Users,
  Plus,
  LayoutDashboard,
  Calendar,
  Clock,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface Staff {
  id: number;
  name: string;
  serviceType: string;
  dailyCapacity: number;
  todayLoad: string;
  status: string;
}

export default function StaffPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    serviceType: "Doctor",
    dailyCapacity: 5,
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");
    if (!loggedIn) {
      //   router.push("/");
    } else {
      setIsLoggedIn(true);
      setUser(userData ? JSON.parse(userData) : null);
      // Load demo staff data
      setStaffList([
        {
          id: 1,
          name: "Dr. Riya Sharma",
          serviceType: "Doctor",
          dailyCapacity: 5,
          todayLoad: "4/5",
          status: "AVAILABLE",
        },
        {
          id: 2,
          name: "Dr. Farhan Khan",
          serviceType: "Doctor",
          dailyCapacity: 5,
          todayLoad: "5/5",
          status: "ON_LEAVE",
        },
        {
          id: 3,
          name: "Dr. Sarah Ahmed",
          serviceType: "Doctor",
          dailyCapacity: 5,
          todayLoad: "2/5",
          status: "AVAILABLE",
        },
        {
          id: 4,
          name: "Nurse John",
          serviceType: "Nurse",
          dailyCapacity: 8,
          todayLoad: "3/8",
          status: "AVAILABLE",
        },
        {
          id: 5,
          name: "Nurse Maria",
          serviceType: "Nurse",
          dailyCapacity: 8,
          todayLoad: "6/8",
          status: "AVAILABLE",
        },
      ]);
    }
  }, [router]);

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

  const handleStatusChange = (id: number, newStatus: string) => {
    setStaffList(
      staffList.map((staff) =>
        staff.id === id ? { ...staff, status: newStatus } : staff,
      ),
    );
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
            { href: "/staff", icon: Users, label: "Staff", active: true },
            { href: "/services", icon: Calendar, label: "Services" },
            { href: "/appointments", icon: Calendar, label: "Appointments" },
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
                Staff Management
              </h1>
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
                    <label className="text-sm font-medium">
                      Daily Capacity
                    </label>
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

          {/* Staff Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>View and manage your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Capacity
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Today's Load
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
                    {staffList.map((staff) => (
                      <tr
                        key={staff.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{staff.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {staff.serviceType}
                        </td>
                        <td className="py-3 px-4">{staff.dailyCapacity}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-200 rounded-full h-2 w-24">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{
                                  width: `${(parseInt(staff.todayLoad.split("/")[0]) / staff.dailyCapacity) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {staff.todayLoad}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              staff.status === "AVAILABLE"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {staff.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={staff.status}
                            onChange={(e) =>
                              handleStatusChange(staff.id, e.target.value)
                            }
                            className="text-sm px-2 py-1 border border-border rounded"
                          >
                            <option value="AVAILABLE">Available</option>
                            <option value="ON_LEAVE">On Leave</option>
                          </select>
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
