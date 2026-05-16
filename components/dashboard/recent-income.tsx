"use client";

import { TrendingUp, IndianRupee, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IncomeEntry } from "./income-tracker";

interface RecentIncomeProps {
  income: IncomeEntry[];
  onViewAll: () => void;
}

export function RecentIncome({ income, onViewAll }: RecentIncomeProps) {
  const recentIncome = income
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Recent Income</CardTitle>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {recentIncome.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No income recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentIncome.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{entry.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      {entry.category} •{" "}
                      {new Date(entry.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-primary">
                  ₹{entry.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
