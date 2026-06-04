"use client";

import { LayoutDashboard, Car, IndianRupee, Wrench, GraduationCap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "cars", label: "My Cars", icon: Car },
  { id: "income", label: "Financials", icon: IndianRupee },
  { id: "services", label: "Service Scheduler", icon: Wrench },
];

export function Sidebar({ activeTab, onTabChange, isOpen }: SidebarProps) {
  // Normalize tab for schedule/services tab consistency
  const currentTab = activeTab === "schedule" ? "services" : activeTab;

  return (
    <aside className={cn(
      "hidden flex-col border-r bg-card md:flex transition-all duration-300 ease-in-out shrink-0 sticky top-[68px] h-[calc(100vh-68px)] overflow-hidden",
      isOpen ? "w-64 border-border" : "w-0 border-transparent"
    )}>
      {/* Inner wrapper to prevent navigation text squishing during width transition */}
      <div className="w-64 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center p-4 border-b border-border min-h-[57px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2">
            Main Management
          </p>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5 p-3">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 group outline-none",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {/* Left active line accent */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-primary" />
                )}
                <item.icon className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"
                )} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Owner Qualifications Section */}
        <div className="mt-auto border-t border-border p-4 space-y-3">
          <div className="rounded-xl border border-border bg-secondary/15 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4.5 w-4.5 text-primary shrink-0" />
              <span className="text-xs font-bold text-foreground tracking-tight">Education Details</span>
            </div>
            <div className="space-y-1.5 font-medium">
              <div className="flex items-start gap-2">
                <Award className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-tight text-muted-foreground">
                  Rahara Ramkrishna Mission
                </p>
              </div>
              <div className="flex items-start gap-2 pl-5.5">
                <p className="text-[10px] leading-tight text-muted-foreground/75 font-mono">
                  Radio & TV Technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
