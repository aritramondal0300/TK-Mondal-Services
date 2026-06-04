"use client";

import { useState } from "react";
import { Plus, IndianRupee, Trash2, TrendingDown, Calendar, Wrench, Settings, ShieldCheck, Package, CircleDot, ChevronRight, Fuel, User, Home, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseTrackerProps {
  expenses: ExpenseEntry[];
  onAddExpense: (entry: Omit<ExpenseEntry, "id">) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpenseTracker({ expenses, onAddExpense, onDeleteExpense }: ExpenseTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    description: "",
    amount: 0,
    category: "Parts Purchase",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense(newEntry);
    setNewEntry({
      description: "",
      amount: 0,
      category: "Parts Purchase",
      date: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(false);
  };

  const totalExpense = expenses.reduce((sum, entry) => sum + entry.amount, 0);
  const thisMonthExpense = expenses
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, entry) => sum + entry.amount, 0);

  // Helper for Category Icons and Styles
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "Parts Purchase":
        return {
          icon: Package,
          colorClass: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20",
        };
      case "Fuel":
        return {
          icon: Fuel,
          colorClass: "text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/20",
        };
      case "Salary/Wages":
        return {
          icon: User,
          colorClass: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20",
        };
      case "Rent/Utilities":
        return {
          icon: Home,
          colorClass: "text-violet-600 bg-violet-500/10 border-violet-500/20 dark:text-violet-400 dark:bg-violet-500/20",
        };
      default:
        return {
          icon: CircleDot,
          colorClass: "text-slate-600 bg-slate-500/10 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/20",
        };
    }
  };

  return (
    <Card className="bg-card border-border shadow-xs hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-foreground text-lg font-bold tracking-tight">Expense Tracker</CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl font-bold">Add Expense Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                <Input
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  placeholder="e.g., Engine oil stock purchase"
                  className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount (₹)</label>
                  <Input
                    type="number"
                    value={newEntry.amount || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 2500"
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden"
                  >
                    <option value="Parts Purchase">Parts Purchase</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Salary/Wages">Salary/Wages</option>
                    <option value="Rent/Utilities">Rent/Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <Button type="submit" variant="destructive" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 mt-2 py-2.5 transition-colors font-medium">
                Add Expense Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Expense Stats Bar */}
        <div className="grid gap-3 grid-cols-2 mb-6">
          <div className="relative overflow-hidden flex items-center justify-between rounded-xl border border-border bg-secondary/10 p-3 sm:p-4">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate block">Total Expenses</span>
              <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight truncate">₹{totalExpense.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shadow-xs">
              <TrendingDown className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="relative overflow-hidden flex items-center justify-between rounded-xl border border-border bg-secondary/10 p-3 sm:p-4">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate block">This Month</span>
              <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight truncate">₹{thisMonthExpense.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shadow-xs">
              <Calendar className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-secondary/10 p-6">
            <IndianRupee className="mb-4 h-12 w-12 text-muted-foreground/30 animate-pulse" />
            <h3 className="text-sm font-semibold text-foreground">No expenses logged</h3>
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {expenses.map((entry) => {
              const categoryConfig = getCategoryConfig(entry.category);
              const CatIcon = categoryConfig.icon;

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/15 p-3 hover:bg-secondary/35 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${categoryConfig.colorClass}`}>
                      <CatIcon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate leading-snug">{entry.description}</h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium bg-card px-1.5 py-0.5 rounded-sm border border-border">{entry.category}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/45" />
                        <span>
                          {new Date(entry.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      -₹{entry.amount.toLocaleString("en-IN")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      onClick={() => onDeleteExpense(entry.id)}
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
