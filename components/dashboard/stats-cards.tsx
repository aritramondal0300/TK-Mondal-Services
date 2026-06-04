"use client";

import { IndianRupee, Car, Wrench, Calendar, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalIncome: number;
  totalExpenses: number;
  totalCars: number;
  pendingServices: number;
}

export function StatsCards({ totalIncome, totalExpenses, totalCars, pendingServices }: StatsCardsProps) {
  const netProfit = totalIncome - totalExpenses;
  const isProfitPositive = netProfit >= 0;

  const stats = [
    {
      label: "Total Income",
      value: `₹${totalIncome.toLocaleString("en-IN")}`,
      icon: ArrowUpRight,
      changeType: "positive" as const,
      bgClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
      textClass: "text-emerald-600 dark:text-emerald-400",
      borderClass: "hover:border-emerald-500/50",
    },
    {
      label: "Total Expenses",
      value: `₹${totalExpenses.toLocaleString("en-IN")}`,
      icon: ArrowDownRight,
      changeType: "negative" as const,
      bgClass: "bg-rose-500/10 dark:bg-rose-500/20",
      textClass: "text-rose-600 dark:text-rose-400",
      borderClass: "hover:border-rose-500/50",
    },
    {
      label: "Net Profit",
      value: `₹${netProfit.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      changeType: (isProfitPositive ? "positive" : "negative") as any,
      bgClass: isProfitPositive ? "bg-teal-500/10 dark:bg-teal-500/20" : "bg-red-500/10 dark:bg-red-500/20",
      textClass: isProfitPositive ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400",
      borderClass: isProfitPositive ? "hover:border-teal-500/50" : "hover:border-red-500/50",
    },
    {
      label: "Active Fleet",
      value: `${totalCars} Cars`,
      icon: Car,
      changeType: "neutral" as const,
      bgClass: "bg-blue-500/10 dark:bg-blue-500/20",
      textClass: "text-blue-600 dark:text-blue-400",
      borderClass: "hover:border-blue-500/50",
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className={`bg-card border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default ${stat.borderClass}`}
        >
          <CardContent className="p-3.5 sm:p-6">
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg sm:text-3xl font-bold text-foreground tracking-tight truncate leading-none mt-1 sm:mt-2">{stat.value}</p>
              </div>
              <div className={`flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${stat.bgClass} ${stat.textClass} shadow-xs`}>
                <stat.icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
