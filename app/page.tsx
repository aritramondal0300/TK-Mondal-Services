"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CarsList, type Car } from "@/components/dashboard/cars-list";
import { IncomeTracker, type IncomeEntry } from "@/components/dashboard/income-tracker";
import { ServiceScheduler, type ServiceEntry } from "@/components/dashboard/service-scheduler";
import { UpcomingServices } from "@/components/dashboard/upcoming-services";
import { RecentIncome } from "@/components/dashboard/recent-income";

// Initial sample data
const initialCars: Car[] = [
  {
    id: "1",
    name: "Maruti Swift Dzire",
    model: "2021",
    registrationNumber: "WB-26-A-1234",
    fuelType: "Petrol",
    lastService: "2024-01-15",
    nextService: "2024-07-15",
    mileage: 45000,
  },
  {
    id: "2",
    name: "Hyundai i20",
    model: "2019",
    registrationNumber: "WB-26-B-5678",
    fuelType: "Diesel",
    lastService: "2024-02-20",
    nextService: "2024-08-20",
    mileage: 62000,
  },
];

const initialIncome: IncomeEntry[] = [
  {
    id: "1",
    description: "Oil Change Service - Swift Dzire",
    amount: 3500,
    category: "Service",
    date: "2024-05-10",
  },
  {
    id: "2",
    description: "AC Repair Work",
    amount: 5000,
    category: "Repair",
    date: "2024-05-08",
  },
  {
    id: "3",
    description: "Battery Replacement",
    amount: 6500,
    category: "Parts",
    date: "2024-05-05",
  },
  {
    id: "4",
    description: "General Service - i20",
    amount: 4500,
    category: "Service",
    date: "2024-05-01",
  },
];

const initialServices: ServiceEntry[] = [
  {
    id: "1",
    carId: "1",
    carName: "Maruti Swift Dzire",
    serviceType: "Oil Change",
    description: "Full synthetic oil change",
    scheduledDate: "2024-05-20",
    status: "pending",
    cost: 3500,
  },
  {
    id: "2",
    carId: "2",
    carName: "Hyundai i20",
    serviceType: "PUC Renewal",
    description: "Annual PUC certificate renewal",
    scheduledDate: "2024-05-25",
    status: "pending",
    cost: 500,
  },
  {
    id: "3",
    carId: "1",
    carName: "Maruti Swift Dzire",
    serviceType: "Tire Rotation",
    description: "",
    scheduledDate: "2024-06-01",
    status: "pending",
    cost: 800,
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [cars, setCars] = useState<Car[]>([]);
  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [services, setServices] = useState<ServiceEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCars = localStorage.getItem("tk-mondal-cars");
    const savedIncome = localStorage.getItem("tk-mondal-income");
    const savedServices = localStorage.getItem("tk-mondal-services");

    setCars(savedCars ? JSON.parse(savedCars) : initialCars);
    setIncome(savedIncome ? JSON.parse(savedIncome) : initialIncome);
    setServices(savedServices ? JSON.parse(savedServices) : initialServices);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (cars.length > 0) {
      localStorage.setItem("tk-mondal-cars", JSON.stringify(cars));
    }
  }, [cars]);

  useEffect(() => {
    if (income.length > 0) {
      localStorage.setItem("tk-mondal-income", JSON.stringify(income));
    }
  }, [income]);

  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem("tk-mondal-services", JSON.stringify(services));
    }
  }, [services]);

  // Car handlers
  const handleAddCar = (car: Omit<Car, "id">) => {
    const newCar = { ...car, id: Date.now().toString() };
    setCars([...cars, newCar]);
  };

  const handleDeleteCar = (id: string) => {
    setCars(cars.filter((car) => car.id !== id));
  };

  // Income handlers
  const handleAddIncome = (entry: Omit<IncomeEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setIncome([newEntry, ...income]);
  };

  const handleDeleteIncome = (id: string) => {
    setIncome(income.filter((entry) => entry.id !== id));
  };

  // Service handlers
  const handleAddService = (service: Omit<ServiceEntry, "id">) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices([...services, newService]);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleUpdateServiceStatus = (id: string, status: "pending" | "completed" | "overdue") => {
    setServices(
      services.map((service) => (service.id === id ? { ...service, status } : service))
    );
  };

  // Calculate stats
  const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
  const pendingServices = services.filter((s) => s.status === "pending").length;
  const upcomingServices = services.filter((s) => {
    const serviceDate = new Date(s.scheduledDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return s.status === "pending" && serviceDate <= thirtyDaysFromNow;
  }).length;

  const renderContent = () => {
    switch (activeTab) {
      case "cars":
        return (
          <CarsList cars={cars} onAddCar={handleAddCar} onDeleteCar={handleDeleteCar} />
        );
      case "income":
        return (
          <IncomeTracker
            income={income}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        );
      case "services":
      case "schedule":
        return (
          <ServiceScheduler
            services={services}
            cars={cars}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
            onUpdateStatus={handleUpdateServiceStatus}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <StatsCards
              totalIncome={totalIncome}
              totalCars={cars.length}
              pendingServices={pendingServices}
              upcomingServices={upcomingServices}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <UpcomingServices
                services={services}
                onViewAll={() => setActiveTab("services")}
              />
              <RecentIncome income={income} onViewAll={() => setActiveTab("income")} />
            </div>
            <CarsList cars={cars} onAddCar={handleAddCar} onDeleteCar={handleDeleteCar} />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab === "cars"
                ? "My Cars"
                : activeTab === "income"
                ? "Income Tracker"
                : activeTab === "services" || activeTab === "schedule"
                ? "Service Schedule"
                : "Dashboard"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "overview"
                ? "Welcome back, Mr. Tapas Kumar Mondal"
                : activeTab === "cars"
                ? "Manage your vehicles"
                : activeTab === "income"
                ? "Track your earnings"
                : "Manage upcoming services"}
            </p>
          </div>
          {renderContent()}
        </main>
      </div>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
