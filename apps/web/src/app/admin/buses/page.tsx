"use client";

import { useEffect, useState } from "react";
import BusForm from "./BusForm";
import BusTable from "./BusTable";

export type BusStatus = "idle" | "active" | "maintenance";

export type Bus = {
  name: string;
  plate_number: string;
  capacity: number;
};

export default function BusPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // TODO: Replace localStorage with real API calls for BT-14
  useEffect(() => {
  const stored = localStorage.getItem("buses");
  if (stored) {
    setBuses(JSON.parse(stored));
  }
  setIsLoaded(true);
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
  if (!isLoaded) return; // Don't save until we've loaded the initial data

  localStorage.setItem("buses", JSON.stringify(buses));
  console.log("Saved buses:", buses);
  }, [buses, isLoaded]);

  const handleAdd = (bus: Bus) => {
    setBuses((prev) => [...prev, bus]);
  };

  const handleDelete = (plate_number: string) => {
    setBuses((prev) => prev.filter((bus) => bus.plate_number !== plate_number));
  };
  if(!isLoaded) return null;


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🚌 Bus Management</h1>

      <BusForm onAdd={handleAdd} />
      <BusTable buses={buses} onDelete={handleDelete} />
    </div>
  );
}