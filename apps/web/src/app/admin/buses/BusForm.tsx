"use client";

import { useState } from "react";
import { Bus, BusStatus } from "./page";
import { Button } from "@/components/ui/button";

export default function BusForm({ onAdd }: { onAdd: (bus: Bus) => void }) {
  const [name, setName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

if (!name || !plateNumber || !capacity) {
      setError("All fields are required");
      return;
    }

    const newBus: Bus = {
      name: name,
      plate_number: plateNumber,
      capacity: Number(capacity),
    };

    onAdd(newBus);

    // Reset
    setName("");
    setPlateNumber("");
    setCapacity("");
    setError("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Create Bus</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Bus Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Plate Number"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Seating Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <Button type="submit">
          Create Bus
        </Button>
        
      </form>
    </div>
  );
}