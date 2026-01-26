"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  LogOut,
  Menu,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/services", label: "Services", icon: Calendar },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/queue", label: "Queue", icon: Clock },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className={`flex items-center gap-2 ${!open && "hidden"}`}>
          <div className="bg-sidebar-primary rounded p-2">
            <Calendar className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-lg">AppointMent</span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-1 hover:bg-sidebar-accent rounded"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent"
                }`}
            >
              <Icon className="w-5 h-5" />
              {open && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
