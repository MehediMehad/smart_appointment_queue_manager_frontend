"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/layout/Sidebar";
import { BASE_URL } from "@/lib/BaseUrl";
// import { getAuthAction } from "@/actions/auth-actions";   // if you want to use it

interface DashboardSummary {
  totalToday: number;
  completed: number;
  pending: number;
  waitingQueue: number;
  staffLoad: Array<{
    name: string;
    load: string;
    status: string;
    serviceType?: string;
  }>;
  date: string;
}

interface ActivityLog {
  id: string;
  time: string;
  message: string;
  action?: string;
  staffName?: string | null;
  customerName?: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optional: fetch current user name from token / context
  const [userName, setUserName] = useState<string>("User");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTc2ZTE1NjlhM2Q0MzkzNTRhNjZlMjgiLCJyb2xlIjoiVVNFUiIsImVtYWlsIjoibW9kZXJ0b3JAMTIwMGIuY29tIiwiaWF0IjoxNzY5NDQ4Njk2LCJleHAiOjE3Njk0NDk1OTZ9.wc4HXV8SHWVyYAc3tTOcQ017rZOUB2_pKbMlIs7FUfw";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Dashboard summary
        const summaryRes = await fetch(`${BASE_URL}/dashboard/summary`, {
          credentials: "include", // important if using cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!summaryRes.ok) throw new Error("Failed to load dashboard summary");

        const summaryJson = await summaryRes.json();
        if (summaryJson.success) {
          setSummary(summaryJson.data);
        }

        // 2. Recent activity logs (you can adjust limit / filters)
        const logsRes = await fetch(
          `${BASE_URL}/dashboard/recent-activity-logs?limit=8`,
          {
            credentials: "include", // important if using cookies
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!logsRes.ok) throw new Error("Failed to load activity logs");

        const logsJson = await logsRes.json();
        if (logsJson.success) {
          setLogs(logsJson.data || []);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong while loading dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Optional: refresh every 60–120 seconds
    // const interval = setInterval(fetchDashboardData, 90000);
    // return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8 space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive text-xl">Error</p>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {userName}!
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Total Appointments"
              value={summary?.totalToday ?? 0}
              sub="Today"
              color="text-primary"
            />
            <StatCard
              title="Completed"
              value={summary?.completed ?? 0}
              sub="Today"
              color="text-green-600 dark:text-green-500"
            />
            <StatCard
              title="Pending"
              value={summary?.pending ?? 0}
              sub="Scheduled / Waiting"
              color="text-blue-600 dark:text-blue-500"
            />
            <StatCard
              title="Waiting Queue"
              value={summary?.waitingQueue ?? 0}
              sub="Pending Assignment"
              color="text-orange-600 dark:text-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Staff Load */}
            <Card className="lg:col-span-2 border shadow-sm">
              <CardHeader>
                <CardTitle>Staff Load ({summary?.date || "—"})</CardTitle>
                <CardDescription>Current appointment capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {summary?.staffLoad?.length ? (
                    summary.staffLoad.map((staff, i) => (
                      <StaffLoadItem key={i} staff={staff} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No staff data available today
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/appointments/new">
                  <Button className="w-full">New Appointment</Button>
                </Link>
                <Link href="/queue">
                  <Button variant="outline" className="w-full">
                    Manage Waiting Queue
                  </Button>
                </Link>
                <Link href="/staff">
                  <Button variant="outline" className="w-full">
                    Manage Staff
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6 border shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{log.message}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{log.time}</span>
                          {log.staffName && <span>• {log.staffName}</span>}
                          {log.action && (
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Reusable small components ──
function StatCard({
  title,
  value,
  sub,
  color = "text-foreground",
}: {
  title: string;
  value: number;
  sub: string;
  color?: string;
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function StaffLoadItem({
  staff,
}: {
  staff: DashboardSummary["staffLoad"][number];
}) {
  const [current, max] = staff.load.split("/").map(Number);
  const percentage = max > 0 ? (current / max) * 100 : 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {staff.name} {staff.serviceType && `(${staff.serviceType})`}
        </p>
        <div className="mt-2 bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                  ? "bg-orange-500"
                  : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-right whitespace-nowrap">
        <p className="font-medium">{staff.load}</p>
        <Badge
          variant="secondary"
          className={
            staff.status === "BOOKED"
              ? "bg-red-100 text-red-800 hover:bg-red-100"
              : "bg-green-100 text-green-800 hover:bg-green-100"
          }
        >
          {staff.status}
        </Badge>
      </div>
    </div>
  );
}
