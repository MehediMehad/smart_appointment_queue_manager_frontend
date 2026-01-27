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
import Sidebar from "@/components/layout/Sidebar";
import Header from "./Header";
import { getAllStaff, updateStaffStatus } from "@/actions/staff"; // adjust path if needed

// Adjust interface to match real API response
interface Staff {
  id: string; // changed from number → string (MongoDB ObjectId)
  name: string;
  serviceType: string;
  dailyCapacity: number;
  status: "Available" | "OnLeave";
  createdAt?: string; // optional - exists in API
  // todayLoad is not in API → we'll show "-" or remove column if not needed
}

export default function StaffPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllStaff(1, 25);

      if (result.success && Array.isArray(result.data)) {
        setStaffList(result.data);
      } else {
        setError(result.message || "Failed to load staff members");
        console.error(result);
      }
    } catch (err: any) {
      setError(err.message || "Network/server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoggedIn(true);

    fetchStaff();
  }, [router]);

  // Real API status update + refresh list
  const handleStatusChange = async (
    staffId: string,
    newStatus: "Available" | "OnLeave",
  ) => {
    try {
      const result = await updateStaffStatus(staffId, newStatus);

      if (result.success) {
        // Option 1: optimistic + refresh
        setStaffList((prev) =>
          prev.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s)),
        );

        // Option 2: just re-fetch (more reliable if other fields can change)
        await fetchStaff();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong");
      console.error(err);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Header />

          {/* Staff Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>View and manage your team</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center text-muted-foreground">
                  Loading staff members...
                </div>
              ) : error ? (
                <div className="py-10 text-center text-destructive">
                  {error}
                </div>
              ) : staffList.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  No staff members found
                </div>
              ) : (
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
                        {/* <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Today's Load
                        </th> */}
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
                          <td className="py-3 px-4 font-medium">
                            {staff.name}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {staff.serviceType}
                          </td>
                          <td className="py-3 px-4">{staff.dailyCapacity}</td>
                          {/* <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-200 rounded-full h-2 w-24">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                — / {staff.dailyCapacity}
                              </span>
                            </div>
                          </td> */}
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                staff.status === "Available"
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
                                handleStatusChange(
                                  staff.id,
                                  e.target.value as "Available" | "OnLeave",
                                )
                              }
                              className="text-sm px-2 py-1 border border-border rounded bg-background"
                            >
                              <option value="Available">Available</option>
                              <option value="OnLeave">On Leave</option>
                            </select>
                          </td>
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
    </div>
  );
}
