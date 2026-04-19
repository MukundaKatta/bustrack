"use client";

import { Bus } from "./page";
import { Button } from "@/components/ui/button"; 

export default function BusTable({
  buses,
  onDelete,
}: {
  buses: Bus[];
  onDelete: (plate_number: string) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Bus List</h2>

      {buses.length === 0 ? (
        <p className="text-gray-500">No buses yet...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Bus Name</th>
                <th className="p-3 text-left">Plate Number</th>
                <th className="p-3 text-left">Capacity</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {buses.map((bus) => (
                <tr key={bus.plate_number} className="border-t hover:bg-gray-50">
                  <td className="p-3">{bus.name}</td>
                  <td className="p-3">{bus.plate_number}</td>
                  <td className="p-3">{bus.capacity}</td>

                  <td className="p-3">
                  <Button
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white border-none"
                    onClick={() => onDelete(bus.plate_number)}
                  >
                    Delete
                  </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}