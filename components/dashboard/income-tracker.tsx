"use client";

import { useState } from "react";
import { Plus, IndianRupee, Trash2, TrendingUp } from "lucide-react";
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

export interface IncomeEntry {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  carId?: string;
}

interface IncomeTrackerProps {
  income: IncomeEntry[];
  onAddIncome: (entry: Omit<IncomeEntry, "id">) => void;
  onDeleteIncome: (id: string) => void;
}

export function IncomeTracker({ income, onAddIncome, onDeleteIncome }: IncomeTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    description: "",
    amount: 0,
    category: "Service",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIncome(newEntry);
    setNewEntry({
      description: "",
      amount: 0,
      category: "Service",
      date: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(false);
  };

  const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
  const thisMonthIncome = income
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Income Tracker</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            This month: ₹{thisMonthIncome.toLocaleString("en-IN")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-1 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Income Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Description</label>
                <Input
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  placeholder="e.g., Oil change service"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Amount (₹)</label>
                  <Input
                    type="number"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 500"
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                  >
                    <option value="Service">Service</option>
                    <option value="Repair">Repair</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Parts">Parts Sale</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Date</label>
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Add Income
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Total Income</span>
          </div>
          <span className="text-xl font-bold text-primary">₹{totalIncome.toLocaleString("en-IN")}</span>
        </div>

        {income.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <IndianRupee className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No income entries yet</p>
            <p className="text-sm text-muted-foreground/70">Start tracking your earnings</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {income.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div>
                  <h4 className="font-medium text-foreground">{entry.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    {entry.category} • {new Date(entry.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">₹{entry.amount.toLocaleString("en-IN")}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteIncome(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
