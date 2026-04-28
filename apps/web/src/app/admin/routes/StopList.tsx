'use client';

import { Button } from '@/components/ui/button';
import type { StopField, StopInput } from './useRouteForm';

type StopListProps = {
  stops: StopInput[];
  onAddStop: () => void;
  onRemoveStop: (id: string) => void;
  onUpdateStop: (id: string, field: StopField, value: string) => void;
};

export function StopList({ stops, onAddStop, onRemoveStop, onUpdateStop }: StopListProps) {
  return (
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
            {stops.map((stop) => (
              <tr key={stop.id} className="border-t">
                <td className="px-4 py-2">
                  <input
                    id={`name-${stop.id}`}
                    type="text"
                    placeholder="Stop Name"
                    value={stop.name}
                    onChange={(e) => onUpdateStop(stop.id, 'name', e.target.value)}
                    className="p-2 w-full outline-none bg-transparent focus:bg-gray-100 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    id={`lat-${stop.id}`}
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={stop.latitude}
                    onChange={(e) => onUpdateStop(stop.id, 'latitude', e.target.value)}
                    className="p-2 w-full outline-none bg-transparent focus:bg-gray-100 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    id={`lng-${stop.id}`}
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={stop.longitude}
                    onChange={(e) => onUpdateStop(stop.id, 'longitude', e.target.value)}
                    className="p-2 w-full outline-none bg-transparent focus:bg-gray-100 rounded"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onRemoveStop(stop.id)}
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
                  onClick={onAddStop}
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
  );
}
