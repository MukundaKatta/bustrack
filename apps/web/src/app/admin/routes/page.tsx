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
  id: string;
  name: string;
  latitude: string;
  longitude: string;
};

type StoredBus = {
  name: string;
  plate_number: string;
};


export default function CreateRoutePage() {
  const [routeName, setRouteName] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [buses, setBuses] = useState<Bus[]>([]);

  const [stops, setStops] = useState<StopInput[]>([
    { id: crypto.randomUUID(), name: "", latitude: "", longitude: "" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // TODO: Replace localStorage with API call: GET /api/buses

  useEffect(() => {
    const stored = localStorage.getItem("buses");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      // Mapping old structure → Prisma-aligned structure
      const formatted: Bus[] = parsed.map((b: StoredBus) => ({
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
      { id: crypto.randomUUID(), name: "", latitude: "", longitude: "" },
    ]);
  };

  const removeStop = (id: string) => {
    if (stops.length === 1) return;

    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStop = (
    id: string,
    field: "name" | "latitude" | "longitude",
    value: string
  ) => {
    setStops((prev) =>
    prev.map((s) =>
    s.id === id? {...s, [field]: value} : s)
    );
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
        isNaN(Number(stop.latitude)) || isNaN(Number(stop.longitude))
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
      setStops([{id: crypto.randomUUID(), name: "", latitude: "", longitude: "" }]);
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

      <form 
        onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        }}
      >
        <div className="mb-4">
          <label htmlFor="routeName" className="block mb-1 font-medium">
            Route Name <span className="text-red-500">*</span>
          </label>
          <input
            id="routeName"
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter route name"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bus" className="block mb-1 font-medium">
            Select Bus <span className="text-red-500">*</span>
          </label>
          <select
            id="bus"
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
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
          
          <h2 className="font-medium mb-3">List of Stops</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full  text-sm">
                <thead className="border-r-gray-100 text-gray-700">
                  <tr>
                  <th className="text-left px-4 py-2">Stop Name</th>
                  <th className="text-center px-4 py-2">Latitude</th>
                  <th className="text-center px-4 py-2">Longitude</th>
                  <th className="text-center px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stops.map((stop, index) => (
                  <tr key={stop.id} className="border-t">
                    <td className="px-4 py-2">
                      <input
                        id={`name-${stop.id}`}
                        type="text"
                        placeholder="Stop Name"
                        value={stop.name}
                        onChange={(e) =>
                          updateStop(stop.id, "name", e.target.value)
                        }
                        className="p-2 w-full outline-noe bg-transparent focus:bg-gray-100 rounded"
                      />
                    </td>             
                    <td className="px-4 py-2">
                      <input
                        id={`lat-${stop.id}`}
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={stop.latitude}
                        onChange={(e) =>
                          updateStop(stop.id, "latitude", e.target.value)
                        }
                        className="p-2 w-full outline-noe bg-transparent focus:bg-gray-100 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        id={`lng-${stop.id}`}
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={stop.longitude}
                        onChange={(e) =>
                          updateStop(stop.id, "longitude", e.target.value)
                        }
                        className="p-2 w-full outline-noe bg-transparent focus:bg-gray-100 rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeStop(stop.id)}
                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-4 py-2">
                    <Button 
                      type="button"
                      onClick={addStop} 
                      variant="outline"
                      className="bg-green-500 hover:bg-green-600 text-white border-none py-2 w-full"
                    >
                      Add Stop
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>          
        </div>

        <Button type="submit" className="w-full">
          Create Route
        </Button>
      </form>
    </div>
  );
}