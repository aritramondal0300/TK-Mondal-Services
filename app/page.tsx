"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CarsList, type Car } from "@/components/dashboard/cars-list";
import { IncomeTracker, type IncomeEntry } from "@/components/dashboard/income-tracker";
import { ExpenseTracker, type ExpenseEntry } from "@/components/dashboard/expense-tracker";
import { ServiceScheduler, type ServiceEntry } from "@/components/dashboard/service-scheduler";
import { UpcomingServices } from "@/components/dashboard/upcoming-services";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [carsRes, incomeRes, expensesRes, servicesRes] = (await Promise.all([
          fetch('/api/cars').then(res => res.json()),
          fetch('/api/income').then(res => res.json()),
          fetch('/api/expenses').then(res => res.json()),
          fetch('/api/services').then(res => res.json())
        ])) as any[];

        if (carsRes.error || incomeRes.error || expensesRes.error || servicesRes.error) {
          throw new Error(carsRes.error || incomeRes.error || expensesRes.error || servicesRes.error);
        }

        setCars(Array.isArray(carsRes) ? carsRes : []);
        setIncome(Array.isArray(incomeRes) ? incomeRes : []);
        setExpenses(Array.isArray(expensesRes) ? expensesRes : []);
        setServices(Array.isArray(servicesRes) ? servicesRes : []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Car handlers
  const handleAddCar = async (car: Omit<Car, "id">) => {
    const id = Date.now().toString();
    const newCar = { ...car, id };
    setCars(prev => [...prev, newCar]);

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar)
      });
      if (!res.ok) throw new Error('Failed to save car');
    } catch (error) {
      console.error(error);
      setCars(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleDeleteCar = async (id: string) => {
    const previousCars = [...cars];
    setCars(prev => prev.filter((car) => car.id !== id));

    try {
      const res = await fetch(`/api/cars?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete car');
    } catch (error) {
      console.error(error);
      setCars(previousCars);
    }
  };

  // Income handlers
  const handleAddIncome = async (entry: Omit<IncomeEntry, "id">) => {
    const id = Date.now().toString();
    const newEntry = { ...entry, id };
    setIncome(prev => [newEntry, ...prev]);

    try {
      const res = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      if (!res.ok) throw new Error('Failed to save income');
    } catch (error) {
      console.error(error);
      setIncome(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleDeleteIncome = async (id: string) => {
    const previousIncome = [...income];
    setIncome(prev => prev.filter((entry) => entry.id !== id));

    try {
      const res = await fetch(`/api/income?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete income');
    } catch (error) {
      console.error(error);
      setIncome(previousIncome);
    }
  };

  // Expense handlers
  const handleAddExpense = async (entry: Omit<ExpenseEntry, "id">) => {
    const id = Date.now().toString();
    const newEntry = { ...entry, id };
    setExpenses(prev => [newEntry, ...prev]);

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      if (!res.ok) throw new Error('Failed to save expense');
    } catch (error) {
      console.error(error);
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const previousExpenses = [...expenses];
    setExpenses(prev => prev.filter((entry) => entry.id !== id));

    try {
      const res = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete expense');
    } catch (error) {
      console.error(error);
      setExpenses(previousExpenses);
    }
  };

  // Service handlers
  const handleAddService = async (service: Omit<ServiceEntry, "id">) => {
    const id = Date.now().toString();
    const newService = { ...service, id };
    setServices(prev => [...prev, newService]);

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });
      if (!res.ok) throw new Error('Failed to save service');
    } catch (error) {
      console.error(error);
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleDeleteService = async (id: string) => {
    const previousServices = [...services];
    setServices(prev => prev.filter((service) => service.id !== id));

    try {
      const res = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete service');
    } catch (error) {
      console.error(error);
      setServices(previousServices);
    }
  };

  const handleUpdateServiceStatus = async (id: string, status: "pending" | "completed" | "overdue") => {
    const previousServices = [...services];
    setServices(prev =>
      prev.map((service) => (service.id === id ? { ...service, status } : service))
    );

    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) throw new Error('Failed to update service status');
    } catch (error) {
      console.error(error);
      setServices(previousServices);
    }
  };

  // Calculate stats
  const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenses.reduce((sum, entry) => sum + entry.amount, 0);
  const pendingServices = services.filter((s) => s.status === "pending").length;
  const upcomingServices = services.filter((s) => {
    const serviceDate = new Date(s.scheduledDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return s.status === "pending" && serviceDate <= thirtyDaysFromNow;
  }).length;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading dashboard data from database...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "cars":
        return (
          <CarsList cars={cars} onAddCar={handleAddCar} onDeleteCar={handleDeleteCar} />
        );
      case "income":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <IncomeTracker
              income={income}
              onAddIncome={handleAddIncome}
              onDeleteIncome={handleDeleteIncome}
            />
            <ExpenseTracker
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
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
              totalExpenses={totalExpenses}
              totalCars={cars.length}
              pendingServices={pendingServices}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <UpcomingServices
                services={services}
                onViewAll={() => setActiveTab("services")}
              />
              <RecentTransactions
                income={income}
                expenses={expenses}
                onViewAll={() => setActiveTab("income")}
              />
            </div>
            <CarsList cars={cars} onAddCar={handleAddCar} onDeleteCar={handleDeleteCar} />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background h-screen overflow-hidden">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab === "cars"
                  ? "My Cars"
                  : activeTab === "income"
                    ? "Financials"
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
                    ? "Track earnings and operational expenses"
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
