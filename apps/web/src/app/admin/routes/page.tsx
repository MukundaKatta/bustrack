"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// TODO:
// Types are defined locally due to restricted access.
// Move these to @bustrack/shared once shared types are available.

type Bus = {
  id: string;
  name: string;
  plateNumber: string;
};

type StopInput = {
  name: string;
  latitude: string;
  longitude: string;
};

export default function CreateRoutePage() {
  const [routeName, setRouteName] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [buses, setBuses] = useState<Bus[]>([]);

  const [stops, setStops] = useState<StopInput[]>([
    { name: "", latitude: "", longitude: "" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // TODO(BT-14): Replace localStorage with API call: GET /api/buses

  useEffect(() => {
    const stored = localStorage.getItem("buses");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      // Mapping old structure → Prisma-aligned structure
      const formatted: Bus[] = parsed.map((b: any) => ({
        id: b.plate_number, // temporary ID
        name: b.name,
        plateNumber: b.plate_number,
      }));

      setBuses(formatted);
    } catch (error) {
      console.error("Error reading buses from localStorage:", error);
    }
  }, []);

  const addStop = () => {
    setStops((prev) => [
      ...prev,
      { name: "", latitude: "", longitude: "" },
    ]);
  };

  const removeStop = (index: number) => {
    if (stops.length === 1) return;

    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStop = (
    index: number,
    field: "name" | "latitude" | "longitude",
    value: string
  ) => {
    setStops((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;

      updated[index][field] = value;
      return updated;
    });
    setError("");
  };


  // TODO: Replace localStorage with POST /api/routes
  // Remove Date.now() and use backend-generated ID

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!routeName || !selectedBus) {
      setError("Please enter route name and select a bus.");
      return;
    }

    for (const [index, stop] of stops.entries()) {
      if (!stop.name || !stop.latitude || !stop.longitude) {
        setError(`Stop ${index + 1}: All fields are required.`);
        return;
      }

      if (
        isNaN(Number(stop.latitude)) ||
        isNaN(Number(stop.longitude))
      ) {
        setError(
          `Stop ${index + 1}: Latitude and Longitude must be valid numbers.`
        );
        return;
      }
    }

    const formattedStops = stops.map((stop, index) => ({
      name: stop.name,
      latitude: Number(stop.latitude),
      longitude: Number(stop.longitude),
      sequence: index + 1, // maintains order
    }));

    const newRoute = {
      id: Date.now().toString(), // temporary ID
      name: routeName,
      busId: selectedBus,
      stops: formattedStops,
    };

    try {
      const stored = localStorage.getItem("routes");
      const existingRoutes = stored ? JSON.parse(stored) : [];

      const updatedRoutes = [...existingRoutes, newRoute];

      localStorage.setItem("routes", JSON.stringify(updatedRoutes));

      // TODO: Remove debug logs after API integration
      console.log("Saved Routes:", updatedRoutes);

      setSuccess("Route created successfully!");

      setRouteName("");
      setSelectedBus("");
      setStops([{ name: "", latitude: "", longitude: "" }]);
    } catch (error) {
      console.error("Error saving route:", error);
      setError("Failed to save route. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create Route</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Route Name
        </label>
        <input
          type="text"
          value={routeName}
          onChange={(e) => {
            setRouteName(e.target.value);
            setError("");
          }}
          className="border p-2 w-full rounded"
          placeholder="Enter route name"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">
          Select Bus
        </label>
        <select
          value={selectedBus}
          onChange={(e) => {
            setSelectedBus(e.target.value);
            setError("");
          }}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Bus</option>

          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.name} ({bus.plateNumber})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h2 className="font-medium mb-3">Stops</h2>

        {stops.map((stop, index) => (
          <div
            key={index}
            className="border p-4 rounded mb-3 flex flex-wrap gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Stop Name"
              value={stop.name}
              onChange={(e) =>
                updateStop(index, "name", e.target.value)
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={stop.latitude}
              onChange={(e) =>
                updateStop(index, "latitude", e.target.value)
              }
              className="border p-2 rounded w-[120px]"
            />

            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={stop.longitude}
              onChange={(e) =>
                updateStop(index, "longitude", e.target.value)
              }
              className="border p-2 rounded w-[120px]"
            />

            <Button
              variant="ghost"
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={() => removeStop(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button onClick={addStop} 
          variant="outline"
          className="bg-green-500 hover:br-green-600 text-white border-none"
          >
          + Add Stop
        </Button>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Create Route
      </Button>
    </div>
  );
}