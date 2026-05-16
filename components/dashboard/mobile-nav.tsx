"use client";

import { LayoutDashboard, Car, IndianRupee, Calendar, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "cars", label: "Cars", icon: Car },
  { id: "income", label: "Income", icon: IndianRupee },
  { id: "services", label: "Services", icon: Wrench },
  { id: "schedule", label: "Schedule", icon: Calendar },
];

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
