"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

// TODO(BT-05): Replace this local Bus type with import from @bustrack/shared once shared types are available (Sanjana's PR)
type Bus = {
  id: string;
  name: string;
  plate_number: string;
};

export default function AdminDriversPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bus, setBus] = useState("");
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO(BT-14): Replace mock with axios.get("/api/buses") once backend API is ready
  useEffect(() => {
    const mockBuses: Bus[] = [
      { id: "1", name: "School Bus 1", plate_number: "AP01" },
      { id: "2", name: "School Bus 2", plate_number: "AP02" },
    ];

    console.log("Mock buses:", mockBuses);
    setBuses(mockBuses);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Replace alert with inline validation and success banner
    if (!name || !email || !bus) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/drivers", {
        name,
        email,
        busId: bus,
      });

      alert("Driver created successfully");

      setName("");
      setEmail("");
      setBus("");
    } catch (err) {
      console.log(err);
      alert("Error creating driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Driver
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Driver Name"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Bus */}
          <div className="space-y-1">
            <label htmlFor="bus" className="text-sm font-medium">
              Select Bus <span className="text-red-500">*</span>
            </label>
            <select
              id="bus"
              className="w-full border p-2 rounded"
              value={bus}
              onChange={(e) => setBus(e.target.value)}
            >
              <option value="">Select Bus</option>

              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.plate_number})
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading || !name || !email || !bus}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Driver"}
          </Button>
        </form>
      </div>
    </div>
  );
}