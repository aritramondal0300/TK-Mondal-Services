"use client";

import { Calendar, Car, Wrench, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceEntry } from "./service-scheduler";

interface UpcomingServicesProps {
  services: ServiceEntry[];
  onViewAll: () => void;
}

export function UpcomingServices({ services, onViewAll }: UpcomingServicesProps) {
  const upcomingServices = services
    .filter((s) => s.status === "pending")
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const getDaysUntil = (date: string) => {
    const serviceDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="bg-card border-border shadow-xs hover:shadow-sm transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="text-foreground text-sm sm:text-lg font-bold tracking-tight">Upcoming Services</CardTitle>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </CardHeader>
      <CardContent>
        {upcomingServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">All caught up! No upcoming services.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingServices.map((service) => {
              const daysUntil = getDaysUntil(service.scheduledDate);
              const isUrgent = daysUntil <= 3;
              const isNear = daysUntil <= 7 && daysUntil > 3;

              return (
                <div
                  key={service.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/10 p-3 hover:bg-secondary/20 transition-all duration-200"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isUrgent 
                      ? "bg-destructive/10 text-destructive" 
                      : isNear 
                      ? "bg-amber-500/10 text-amber-500" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    <Wrench className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-xs sm:text-sm truncate">{service.serviceType}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Car className="h-3.5 w-3.5" />
                      <span className="truncate">{service.carName}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-bold ${
                        isUrgent 
                          ? "text-destructive" 
                          : isNear 
                          ? "text-amber-500 dark:text-amber-400" 
                          : "text-primary"
                      }`}
                    >
                      {daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : daysUntil < 0
                        ? `${Math.abs(daysUntil)}d overdue`
                        : `${daysUntil} days left`}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                      {new Date(service.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
