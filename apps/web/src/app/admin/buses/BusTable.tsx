"use client";

import { Bus } from "./page";

export default function BusTable({
  buses,
  onDelete,
}: {
  buses: Bus[];
  onDelete: (index: number) => void;
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
                <th className="p-3 text-left">Bus Number</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Capacity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {buses.map((bus, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3">{bus.busNumber}</td>
                  <td className="p-3">{bus.driverName}</td>
                  <td className="p-3">{bus.capacity}</td>

                  {/* Status Badge */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        bus.status === "active"
                          ? "bg-green-500"
                          : bus.status === "idle"
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => onDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
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