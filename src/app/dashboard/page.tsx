// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
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
import {
  getDashboardSummary,
  getRecentActivityLogs,
} from "@/actions/dashboard";
import { getAuthAction } from "@/actions/auth";

interface DashboardSummary {
  totalToday: number;
  completed: number;
  pending: number;
  waitingQueue: number;
  staffLoad: Array<{
    name: string;
    load: string; // e.g. "3/5"
    status: string;
    serviceType?: string;
  }>;
  date: string;
}

interface ActivityLog {
  id: string;
  time?: string; // maybe your API sends this
  message: string;
  action?: string;
  staffName?: string | null;
  customerName?: string | null;
  createdAt: string; // we'll format this
}

interface CurrentUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function formatLogTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadDashboard = () => {
      startTransition(async () => {
        setLoading(true);
        setError(null);

        try {
          // 1. Summary
          const summaryRes = await getDashboardSummary();

          if (!summaryRes.success) {
            throw new Error(summaryRes.message ?? "Failed to load summary");
          }
          setSummary(summaryRes.data); // assuming it returns the data directly

          // 2. Recent logs
          const logsRes = await getRecentActivityLogs(8);
          if (!logsRes.success) {
            throw new Error(logsRes.message ?? "Failed to load activity logs");
          }
          setLogs(logsRes.data ?? []);
        } catch (err: any) {
          console.error("Dashboard load error:", err);
          setError(err.message || "Could not load dashboard data");
        } finally {
          setLoading(false);
        }
      });
    };

    loadDashboard();

    // Optional: refresh every 2 minutes
    // const interval = setInterval(loadDashboard, 120_000);
    // return () => clearInterval(interval);
  }, []);

  // ── Loading ───────────────────────────────────────────────
  if (loading || isPending) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-6 md:p-8 space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[420px] rounded-xl lg:col-span-2" />
            <Skeleton className="h-[420px] rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-5 max-w-md px-6">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-semibold text-destructive">Oops!</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1.5">Welcome back</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Today"
              value={summary?.totalToday ?? 0}
              sub="Appointments"
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
              sub="Scheduled"
              color="text-blue-600 dark:text-blue-500"
            />
            <StatCard
              title="Waiting Queue"
              value={summary?.waitingQueue ?? 0}
              sub="Unassigned"
              color="text-orange-600 dark:text-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Staff Load */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Staff Load – {summary?.date || "Today"}</CardTitle>
                <CardDescription>
                  Current appointment distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5 pt-2">
                  {summary?.staffLoad?.length ? (
                    summary.staffLoad.map((staff, index) => (
                      <StaffLoadItem key={index} staff={staff} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No staff load data available today
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button asChild>
                  <Link href="/appointments/new">New Appointment</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/queue">Manage Waiting Queue</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/staff">Manage Staff</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="space-y-4 divide-y">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="pt-4 first:pt-0 flex items-start gap-4"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed">{log.message}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatLogTime(log.createdAt)}</span>
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
                <div className="text-center py-12 text-muted-foreground">
                  No recent activity to show
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Components ────────────────────────────────────
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
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
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
    <div className="flex items-center justify-between gap-5">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {staff.name}
          {staff.serviceType && (
            <span className="text-muted-foreground text-sm">
              {" "}
              ({staff.serviceType})
            </span>
          )}
        </p>
        <div className="mt-2.5 bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                  ? "bg-orange-500"
                  : "bg-primary"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold tabular-nums">{staff.load}</p>
        <Badge
          variant="secondary"
          className={
            staff.status === "BOOKED"
              ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
              : "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
          }
        >
          {staff.status}
        </Badge>
      </div>
    </div>
  );
}
