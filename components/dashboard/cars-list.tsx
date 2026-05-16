"use client";

import { useState } from "react";
import { Plus, Fuel, Calendar, Car as CarIcon, Pencil, Trash2 } from "lucide-react";
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

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">My Cars</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-1 h-4 w-4" />
              Add Car
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Car</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Car Name</label>
                  <Input
                    value={newCar.name}
                    onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                    placeholder="e.g., Swift Dzire"
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Model/Year</label>
                  <Input
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    placeholder="e.g., 2022"
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Registration Number</label>
                  <Input
                    value={newCar.registrationNumber}
                    onChange={(e) => setNewCar({ ...newCar, registrationNumber: e.target.value })}
                    placeholder="e.g., WB-XX-1234"
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Fuel Type</label>
                  <select
                    value={newCar.fuelType}
                    onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Last Service Date</label>
                  <Input
                    type="date"
                    value={newCar.lastService}
                    onChange={(e) => setNewCar({ ...newCar, lastService: e.target.value })}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Next Service Date</label>
                  <Input
                    type="date"
                    value={newCar.nextService}
                    onChange={(e) => setNewCar({ ...newCar, nextService: e.target.value })}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Current Mileage (km)</label>
                <Input
                  type="number"
                  value={newCar.mileage}
                  onChange={(e) => setNewCar({ ...newCar, mileage: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 25000"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Add Car
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CarIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No cars added yet</p>
            <p className="text-sm text-muted-foreground/70">Click &quot;Add Car&quot; to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{car.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {car.registrationNumber} • {car.model}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
                    <Fuel className="h-4 w-4" />
                    {car.fuelType}
                  </div>
                  <div className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
                    <Calendar className="h-4 w-4" />
                    Next: {car.nextService || "Not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteCar(car.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
