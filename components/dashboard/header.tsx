"use client";

import { Car, User, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">TK Mondal Services</h1>
            <p className="text-sm text-muted-foreground">Business Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              2
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
              <User className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Mr. Tapas Kumar Mondal</p>
              <p className="text-xs text-muted-foreground">Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
