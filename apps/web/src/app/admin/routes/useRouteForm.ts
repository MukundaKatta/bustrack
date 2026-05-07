'use client';

import { useEffect, useState } from 'react';

// TODO:
// Types are defined locally due to restricted access.
// Move these to @bustrack/shared once shared types are available.

type Bus = {
  id: string;
  name: string;
  plateNumber: string;
};

export type StopInput = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
};

type StoredBus = {
  name: string;
  plate_number: string;
};

export type StopField = 'name' | 'latitude' | 'longitude';

const SUCCESS_MESSAGE_TIMEOUT_MS = 3000;

const createEmptyStop = (): StopInput => ({
  id: crypto.randomUUID(),
  name: '',
  latitude: '',
  longitude: '',
});

export function useRouteForm() {
  const [routeName, setRouteName] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [stops, setStops] = useState<StopInput[]>([createEmptyStop()]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Replace localStorage with API call: GET /api/buses
  useEffect(() => {
    const stored = localStorage.getItem('buses');

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      // Mapping old structure -> Prisma-aligned structure
      const formatted: Bus[] = parsed.map((b: StoredBus) => ({
        id: b.plate_number, // temporary ID
        name: b.name,
        plateNumber: b.plate_number,
      }));

      setBuses(formatted);
    } catch (error) {
      console.error('Error reading buses from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (!success) return;

    const timeoutId = window.setTimeout(() => {
      setSuccess('');
    }, SUCCESS_MESSAGE_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const updateRouteName = (value: string) => {
    setRouteName(value);
  };

  const updateSelectedBus = (value: string) => {
    setSelectedBus(value);
  };

  const addStop = () => {
    setStops((prev) => [...prev, createEmptyStop()]);
  };

  const removeStop = (id: string) => {
    if (stops.length === 1) return;

    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStop = (id: string, field: StopField, value: string) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    setError('');
  };

  // TODO: Replace localStorage with POST /api/routes
  // Remove Date.now() and use backend-generated ID
  
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (!routeName || !selectedBus) {
        setError('Please enter route name and select a bus.');
        return;
      }

      for (const [index, stop] of stops.entries()) {
        if (!stop.name || !stop.latitude || !stop.longitude) {
          setError(`Stop ${index + 1}: All fields are required.`);
          return;
        }

        if (isNaN(Number(stop.latitude)) || isNaN(Number(stop.longitude))) {
          setError(`Stop ${index + 1}: Latitude and Longitude must be valid numbers.`);
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

      const stored = localStorage.getItem('routes');
      const existingRoutes = stored ? JSON.parse(stored) : [];

      const updatedRoutes = [...existingRoutes, newRoute];

      localStorage.setItem('routes', JSON.stringify(updatedRoutes));

      // TODO: Remove debug logs after API integration
      console.log('Saved Routes:', updatedRoutes);

      setSuccess('Route created successfully!');

      setRouteName('');
      setSelectedBus('');
      setStops([createEmptyStop()]);
    } catch (error) {
      console.error('Error saving route:', error);
      setError('Failed to save route. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
