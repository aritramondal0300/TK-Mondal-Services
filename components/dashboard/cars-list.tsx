"use client";

import { useState } from "react";
import { Plus, Fuel, Calendar, Car as CarIcon, Trash2, Gauge, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
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

export interface Car {
  id: string;
  name: string;
  model: string;
  registrationNumber: string;
  fuelType: string;
  lastService: string;
  nextService: string;
  mileage: number;
}

interface CarsListProps {
  cars: Car[];
  onAddCar: (car: Omit<Car, "id">) => void;
  onDeleteCar: (id: string) => void;
}

export function CarsList({ cars, onAddCar, onDeleteCar }: CarsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    name: "",
    model: "",
    registrationNumber: "",
    fuelType: "Petrol",
    lastService: "",
    nextService: "",
    mileage: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCar(newCar);
    setNewCar({
      name: "",
      model: "",
      registrationNumber: "",
      fuelType: "Petrol",
      lastService: "",
      nextService: "",
      mileage: 0,
    });
    setIsDialogOpen(false);
  };

  // Helper to determine service status badge
  const getServiceStatus = (nextServiceDateStr: string) => {
    if (!nextServiceDateStr) return { text: "No Schedule", color: "text-muted-foreground bg-muted border-muted-foreground/10", icon: Clock };

    const nextServiceDate = new Date(nextServiceDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = nextServiceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Overdue", color: "text-destructive bg-destructive/10 border-destructive/20 dark:bg-destructive/20", icon: AlertTriangle };
    } else if (diffDays <= 30) {
      return { text: "Due Soon", color: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20", icon: AlertTriangle };
    } else {
      return { text: "Up to Date", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20", icon: ShieldCheck };
    }
  };

  // Helper for fuel type styles
  const getFuelTypeBadge = (fuelType: string) => {
    switch (fuelType) {
      case "Petrol":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/20";
      case "Diesel":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20";
      case "CNG":
        return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20";
      case "Electric":
        return "text-sky-600 bg-sky-500/10 border-sky-500/20 dark:text-sky-400 dark:bg-sky-500/20";
      default:
        return "text-muted-foreground bg-muted border-muted-foreground/10";
    }
  };

  return (
    <Card className="bg-card border-border shadow-xs hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-foreground text-lg font-bold tracking-tight">My Cars</CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Car
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl font-bold">Add New Car</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Car Name</label>
                  <Input
                    value={newCar.name}
                    onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                    placeholder="e.g., Swift Dzire"
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model/Year</label>
                  <Input
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    placeholder="e.g., 2022"
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration Number</label>
                  <Input
                    value={newCar.registrationNumber}
                    onChange={(e) => setNewCar({ ...newCar, registrationNumber: e.target.value })}
                    placeholder="e.g., WB-26-A-1234"
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fuel Type</label>
                  <select
                    value={newCar.fuelType}
                    onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Service Date</label>
                  <Input
                    type="date"
                    value={newCar.lastService}
                    onChange={(e) => setNewCar({ ...newCar, lastService: e.target.value })}
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Service Date</label>
                  <Input
                    type="date"
                    value={newCar.nextService}
                    onChange={(e) => setNewCar({ ...newCar, nextService: e.target.value })}
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Mileage (km)</label>
                <Input
                  type="number"
                  value={newCar.mileage}
                  onChange={(e) => setNewCar({ ...newCar, mileage: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 25000"
                  className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2 py-2.5 transition-colors font-medium">
                Add Car to Fleet
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-secondary/10 p-6">
            <CarIcon className="mb-4 h-12 w-12 text-muted-foreground/30 animate-bounce" />
            <h3 className="text-sm font-semibold text-foreground">No vehicles in fleet</h3>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {cars.map((car) => {
              const serviceStatus = getServiceStatus(car.nextService);
              const StatusIcon = serviceStatus.icon;

              return (
                <div
                  key={car.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-secondary/15 p-4 hover:bg-secondary/35 transition-all duration-300 hover:shadow-xs hover:border-primary/20"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                      <CarIcon className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground text-sm tracking-tight leading-tight">{car.name}</h4>
                        <span className="text-[10px] text-muted-foreground/60 bg-secondary border border-border px-1.5 py-0.5 rounded-sm font-mono">
                          {car.registrationNumber}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">Model: {car.model}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2.5 mt-1 sm:mt-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-border/40 sm:border-t-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Fuel Tag */}
                      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold border ${getFuelTypeBadge(car.fuelType)}`}>
                        <Fuel className="h-3 w-3" />
                        {car.fuelType}
                      </div>

                      {/* Mileage */}
                      <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold border border-border bg-card text-foreground">
                        <Gauge className="h-3 w-3 text-muted-foreground" />
                        {car.mileage.toLocaleString("en-IN")} km
                      </div>

                      {/* Service Urgency */}
                      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold border ${serviceStatus.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {serviceStatus.text}
                      </div>
                    </div>

                    <div className="flex items-center ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors animate-fade-in"
                        onClick={() => onDeleteCar(car.id)}
                        aria-label="Delete car"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
