"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function AdminDriversPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bus, setBus] = useState("");
  const [buses, setBuses] = useState<any[]>([]);

// for temporary mock data until we have the API ready
useEffect(() => {
  const mockBuses = [
    { id: "1", name: "School Bus 1", plate_number: "AP01" },
    { id: "2", name: "School Bus 2", plate_number: "AP02" }
  ];

  console.log("Mock buses:", mockBuses);
  setBuses(mockBuses);
}, []);

//uncomment this when real API call is ready

 /* useEffect(() => {               
    axios.get("/api/buses")
      .then((res:any) => { 
        console.log("fetched buses:", res.data);
        setBuses(res.data);})
      .catch((err:any) => console.log(err));
  }, []);
*/
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !email || !bus) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("/api/drivers", {
        name,
        email,
        busId: bus
      });

      alert("Driver created successfully");

      setName("");
      setEmail("");
      setBus("");

    } catch (err) {
      console.log(err);
      alert("Error creating driver");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Driver
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Driver Name"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Select Bus <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border p-2 rounded"
              value={bus}
              onChange={(e) => setBus(e.target.value)}
            >
              <option value="">Select Bus</option>

              {buses.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.plate_number})
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled ={!name ||!email || !bus}
            className="w-full">
            Create Driver
          </Button>

        </form>
      </div>
    </div>
  );
}