"use client";

import { useState } from "react";
import { Plus, Wrench, Trash2, Clock, CheckCircle, AlertTriangle, Calendar, CircleDollarSign, Check, Info } from "lucide-react";
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
import type { Car } from "./cars-list";

export interface ServiceEntry {
  id: string;
  carId: string;
  carName: string;
  serviceType: string;
  description: string;
  scheduledDate: string;
  status: "pending" | "completed" | "overdue";
  cost?: number;
}

interface ServiceSchedulerProps {
  services: ServiceEntry[];
  cars: Car[];
  onAddService: (service: Omit<ServiceEntry, "id">) => void;
  onDeleteService: (id: string) => void;
  onUpdateStatus: (id: string, status: "pending" | "completed" | "overdue") => void;
}

export function ServiceScheduler({
  services,
  cars,
  onAddService,
  onDeleteService,
  onUpdateStatus,
}: ServiceSchedulerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    carId: "",
    carName: "",
    serviceType: "Oil Change",
    description: "",
    scheduledDate: "",
    status: "pending" as const,
    cost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCar = cars.find((car) => car.id === newService.carId);
    onAddService({
      ...newService,
      carName: selectedCar?.name || "Unknown",
    });
    setNewService({
      carId: "",
      carName: "",
      serviceType: "Oil Change",
      description: "",
      scheduledDate: "",
      status: "pending",
      cost: 0,
    });
    setIsDialogOpen(false);
  };

  // Helper to determine status and dynamic styles
  const getStatusDetails = (service: ServiceEntry) => {
    if (service.status === "completed") {
      return {
        label: "Completed",
        colorClass: "border-l-4 border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10",
        badgeClass: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20",
        icon: CheckCircle,
      };
    }

    // Check if pending has become overdue based on date
    const serviceDate = new Date(service.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (serviceDate < today) {
      return {
        label: "Overdue",
        colorClass: "border-l-4 border-l-destructive bg-destructive/5 dark:bg-destructive/10 hover:bg-destructive/10",
        badgeClass: "text-destructive bg-destructive/10 border-destructive/20 dark:bg-destructive/20",
        icon: AlertTriangle,
      };
    }

    return {
      label: "Pending",
      colorClass: "border-l-4 border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/10 hover:bg-amber-500/10",
      badgeClass: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20",
      icon: Clock,
    };
  };

  return (
    <Card className="bg-card border-border shadow-xs hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-foreground text-lg font-bold tracking-tight">Service Schedule</CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Schedule Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl font-bold">Schedule New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Car</label>
                <select
                  value={newService.carId}
                  onChange={(e) => setNewService({ ...newService, carId: e.target.value })}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden"
                  required
                >
                  <option value="">Choose a car</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} ({car.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service Type</label>
                  <select
                    value={newService.serviceType}
                    onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden"
                  >
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Rotation">Tire Rotation</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Battery Check">Battery Check</option>
                    <option value="AC Service">AC Service</option>
                    <option value="General Service">General Service</option>
                    <option value="PUC Renewal">PUC Renewal</option>
                    <option value="Insurance Renewal">Insurance Renewal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scheduled Date</label>
                  <Input
                    type="date"
                    value={newService.scheduledDate}
                    onChange={(e) => setNewService({ ...newService, scheduledDate: e.target.value })}
                    className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description (Optional)</label>
                <Input
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="e.g., Full synthetic oil change and filter swap"
                  className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Cost (₹)</label>
                <Input
                  type="number"
                  value={newService.cost || ""}
                  onChange={(e) => setNewService({ ...newService, cost: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 2000"
                  className="bg-input border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2 py-2.5 transition-colors font-medium">
                Schedule Service Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-secondary/10 p-6">
            <Wrench className="mb-4 h-12 w-12 text-muted-foreground/30 animate-spin-slow" />
            <h3 className="text-sm font-semibold text-foreground">No maintenance scheduled</h3>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {services.map((service) => {
              const statusDetails = getStatusDetails(service);
              const StatusIcon = statusDetails.icon;

              return (
                <div
                  key={service.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4 transition-all duration-200 ${statusDetails.colorClass}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() =>
                        onUpdateStatus(
                          service.id,
                          service.status === "completed" ? "pending" : "completed"
                        )
                      }
                      className={`mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${service.status === "completed"
                          ? "bg-primary border-primary text-primary-foreground shadow-xs"
                          : "border-muted-foreground/30 hover:border-primary/50 bg-card text-transparent"
                        }`}
                      aria-label={service.status === "completed" ? "Mark as pending" : "Mark as completed"}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3px]" />
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-semibold text-foreground text-sm leading-none tracking-tight">{service.serviceType}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium">•</span>
                        <span className="text-xs text-foreground/80 font-medium">{service.carName}</span>
                      </div>

                      {service.description && (
                        <p className="text-xs text-muted-foreground/80 leading-normal flex items-start gap-1">
                          <Info className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />
                          <span>{service.description}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                          {new Date(service.scheduledDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2.5 mt-1 sm:mt-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-border/40 sm:border-t-0 pl-8.5 sm:pl-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Cost Badge */}
                      {service.cost && service.cost > 0 ? (
                        <div className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold border border-border bg-card text-foreground">
                          <CircleDollarSign className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                          ₹{service.cost.toLocaleString("en-IN")}
                        </div>
                      ) : null}

                      {/* Status Pill Badge */}
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold border ${statusDetails.badgeClass}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusDetails.label}
                      </div>
                    </div>

                    <div className="flex items-center ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        onClick={() => onDeleteService(service.id)}
                        aria-label="Delete service"
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
