"use client";

import { TrendingUp, IndianRupee, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IncomeEntry } from "./income-tracker";
import type { ExpenseEntry } from "./expense-tracker";

interface RecentTransactionsProps {
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
  onViewAll: () => void;
}

export function RecentTransactions({ income, expenses, onViewAll }: RecentTransactionsProps) {
  const transactions = [
    ...income.map((item) => ({ ...item, type: "income" as const })),
    ...expenses.map((item) => ({ ...item, type: "expense" as const })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-card border-border shadow-xs hover:shadow-sm transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="text-foreground text-sm sm:text-lg font-bold tracking-tight">Recent Transactions</CardTitle>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No transactions logged yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((entry) => {
              const isIncome = entry.type === "income";
              return (
                <div
                  key={`${entry.type}-${entry.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/10 p-3 hover:bg-secondary/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isIncome 
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                    }`}>
                      {isIncome ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowDownRight className="h-4.5 w-4.5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-xs sm:text-sm truncate">{entry.description}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                        <span className="font-medium text-foreground/70">{entry.category}</span> •{" "}
                        {new Date(entry.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold text-xs sm:text-sm shrink-0 ml-2 ${
                    isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}>
                    {isIncome ? "+" : "-"}₹{entry.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
