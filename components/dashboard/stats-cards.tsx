"use client";

import { IndianRupee, Car, Wrench, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalIncome: number;
  totalCars: number;
  pendingServices: number;
  upcomingServices: number;
}

export function StatsCards({ totalIncome, totalCars, pendingServices, upcomingServices }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Income",
      value: `₹${totalIncome.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      label: "Total Cars",
      value: totalCars.toString(),
      icon: Car,
      change: "Active",
      changeType: "neutral" as const,
    },
    {
      label: "Pending Services",
      value: pendingServices.toString(),
      icon: Wrench,
      change: "This week",
      changeType: "neutral" as const,
    },
    {
      label: "Upcoming Services",
      value: upcomingServices.toString(),
      icon: Calendar,
      change: "Next 30 days",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                <p
                  className={`mt-1 text-xs ${
                    stat.changeType === "positive"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
