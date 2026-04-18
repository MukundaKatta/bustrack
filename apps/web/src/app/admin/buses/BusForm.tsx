"use client";

import { useState } from "react";
import { Bus, BusStatus } from "./page";

export default function BusForm({ onAdd }: { onAdd: (bus: Bus) => void }) {
  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState<BusStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!busNumber || !driverName || !capacity) {
      setError("All fields are required");
      return;
    }

    const newBus: Bus = {
      busNumber,
      driverName,
      capacity: Number(capacity),
      status,
    };

    onAdd(newBus);

    // Reset
    setBusNumber("");
    setDriverName("");
    setCapacity("");
    setStatus("idle");
    setError("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Create Bus</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Bus Number"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Driver Name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Seating Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BusStatus)}
          className="w-full p-2 border rounded"
        >
          <option value="idle">Idle</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Bus
        </button>
      </form>
    </div>
  );
}