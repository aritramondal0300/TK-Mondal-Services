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
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Upcoming Services</CardTitle>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {upcomingServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No upcoming services</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingServices.map((service) => {
              const daysUntil = getDaysUntil(service.scheduledDate);
              return (
                <div
                  key={service.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{service.serviceType}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-3 w-3" />
                      {service.carName}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        daysUntil <= 3 ? "text-destructive" : daysUntil <= 7 ? "text-chart-3" : "text-primary"
                      }`}
                    >
                      {daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : daysUntil < 0
                        ? `${Math.abs(daysUntil)} days ago`
                        : `${daysUntil} days`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(service.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
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
