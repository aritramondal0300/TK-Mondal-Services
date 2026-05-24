"use client";

import { LayoutDashboard, Car, IndianRupee, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "cars", label: "Cars", icon: Car },
  { id: "income", label: "Finance", icon: IndianRupee },
  { id: "services", label: "Services", icon: Wrench },
];

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  // Normalize tab for schedule/services tab consistency
  const currentTab = activeTab === "schedule" ? "services" : activeTab;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/90 backdrop-blur-md md:hidden shadow-lg pb-safe">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-bold tracking-tight transition-all duration-200 outline-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "text-primary scale-105" : "text-muted-foreground/80"
              )} />
              {item.label}
              {isActive && (
                <span className="absolute -top-2.5 h-1 w-5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
