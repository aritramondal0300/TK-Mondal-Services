"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Car, User, Sun, Moon, Menu, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md shadow-xs transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <Car className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none">TK Mondal Services</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Business Management Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-600" />
              )
            ) : (
              <span className="h-4.5 w-4.5 block" />
            )}
          </Button>

          {/* User Profile Info & Logout */}
          <div className="flex items-center gap-2 border-l border-border pl-3 sm:pl-4 ml-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary ring-2 ring-primary/10 shadow-inner">
              <img
                src="https://api.dicebear.com/9.x/initials/svg?seed=TKM&backgroundColor=0D8ABC&color=FFFFFF"
                alt="User Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-1"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Log out"
              title="Log out"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <LogOut className="h-4.5 w-4.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

