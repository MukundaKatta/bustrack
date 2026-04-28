'use client';

import { Button } from '@/components/ui/button';
import { StopList } from './StopList';
import { useRouteForm } from './useRouteForm';

export default function CreateRoutePage() {
  const {
    routeName,
    selectedBus,
    buses,
    stops,
    error,
    success,
    isSubmitting,
    updateRouteName,
    updateSelectedBus,
    addStop,
    removeStop,
    updateStop,
    handleSubmit,
  } = useRouteForm();

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
            onChange={(e) => updateRouteName(e.target.value)}
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
            onChange={(e) => updateSelectedBus(e.target.value)}
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

        <StopList
          stops={stops}
          onAddStop={addStop}
          onRemoveStop={removeStop}
          onUpdateStop={updateStop}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Route...' : 'Create Route'}
        </Button>
      </form>
    </div>
  );
}
