"use client";

import { useState } from "react";
import { Plus, Wrench, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-chart-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/20 text-primary";
      case "overdue":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-chart-3/20 text-chart-3";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Service Schedule</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-1 h-4 w-4" />
              Schedule Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Schedule New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Select Car</label>
                <select
                  value={newService.carId}
                  onChange={(e) => setNewService({ ...newService, carId: e.target.value })}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
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
                <div>
                  <label className="text-sm text-muted-foreground">Service Type</label>
                  <select
                    value={newService.serviceType}
                    onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
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
                <div>
                  <label className="text-sm text-muted-foreground">Scheduled Date</label>
                  <Input
                    type="date"
                    value={newService.scheduledDate}
                    onChange={(e) => setNewService({ ...newService, scheduledDate: e.target.value })}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Description (Optional)</label>
                <Input
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="e.g., Full synthetic oil change"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Estimated Cost (₹)</label>
                <Input
                  type="number"
                  value={newService.cost}
                  onChange={(e) => setNewService({ ...newService, cost: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 2000"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Schedule Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wrench className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No services scheduled</p>
            <p className="text-sm text-muted-foreground/70">Schedule maintenance for your cars</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{service.serviceType}</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.carName} • {new Date(service.scheduledDate).toLocaleDateString("en-IN")}
                    </p>
                    {service.description && (
                      <p className="text-xs text-muted-foreground/70">{service.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {service.cost && service.cost > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ₹{service.cost.toLocaleString("en-IN")}
                    </span>
                  )}
                  <button
                    onClick={() =>
                      onUpdateStatus(
                        service.id,
                        service.status === "completed" ? "pending" : "completed"
                      )
                    }
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                      service.status
                    )}`}
                  >
                    {getStatusIcon(service.status)}
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteService(service.id)}
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
