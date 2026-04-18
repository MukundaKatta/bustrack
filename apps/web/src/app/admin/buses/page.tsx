"use client";

import { useEffect, useState } from "react";
import BusForm from "./BusForm";
import BusTable from "./BusTable";

export type BusStatus = "idle" | "active" | "maintenance";

export type Bus = {
  busNumber: string;
  driverName: string;
  capacity: number;
  status: BusStatus;
};

export default function BusPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Load from localStorage
  useEffect(() => {
  const storedBuses = localStorage.getItem("buses");
  if (storedBuses) {
    setBuses(JSON.parse(storedBuses));
  }
  setIsLoaded(true);
}, []);

  // ✅ Save to localStorage
  useEffect(() => {
  if (!isLoaded) return; // 🚨 prevents overwrite

  localStorage.setItem("buses", JSON.stringify(buses));
  console.log("Saved buses:", buses);
}, [buses, isLoaded]);

  const handleAdd = (bus: Bus) => {
    setBuses((prev) => [...prev, bus]);
  };

  const handleDelete = (index: number) => {
    setBuses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🚌 Bus Management</h1>

      <BusForm onAdd={handleAdd} />
      <BusTable buses={buses} onDelete={handleDelete} />
    </div>
  );
}