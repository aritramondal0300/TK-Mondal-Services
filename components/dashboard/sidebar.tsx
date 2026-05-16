"use client";

import { LayoutDashboard, Car, IndianRupee, Calendar, Wrench, FileText, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "cars", label: "My Cars", icon: Car },
  { id: "income", label: "Income", icon: IndianRupee },
  { id: "services", label: "Services", icon: Wrench },
  { id: "schedule", label: "Schedule", icon: Calendar },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
      <nav className="flex flex-col gap-1 p-4">
        <div className="mb-4 px-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-border p-4">
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Education</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Rahara Ramkrishna Mission
          </p>
          <p className="text-xs text-muted-foreground">
            Radio & TV Technology
          </p>
        </div>
      </div>
    </aside>
  );
}
