export interface BusStop {
  name: string;
  lat: number;
  lng: number;
}

export interface MockBus {
  id: string;
  name: string;
  lat: number;
  lng: number;
  nextStop: BusStop;
}

// Dallas, TX area — swap with real DB data when BT-21 lands
export const MOCK_BUSES: MockBus[] = [
  {
    id: 'bus-1',
    name: 'Bus 101',
    lat: 32.7850,
    lng: -96.8100,
    nextStop: { name: 'Greenville Ave Stop', lat: 32.8020, lng: -96.7760 },
  },
  {
    id: 'bus-2',
    name: 'Bus 202',
    lat: 32.7600,
    lng: -96.7800,
    nextStop: { name: 'Deep Ellum Stop', lat: 32.7837, lng: -96.7950 },
  },
  {
    id: 'bus-3',
    name: 'Bus 303',
    lat: 32.7900,
    lng: -96.7500,
    nextStop: { name: 'Lakewood Stop', lat: 32.8050, lng: -96.7300 },
  },
];

// Simulate bus moving toward its next stop — called each 10s tick
// Speed: 30 km/h over 10s = ~0.083 km per tick
const STEP_FRACTION = 0.04; // fraction of remaining distance to cover per tick

export function advanceBus(bus: MockBus): MockBus {
  const newLat = bus.lat + (bus.nextStop.lat - bus.lat) * STEP_FRACTION;
  const newLng = bus.lng + (bus.nextStop.lng - bus.lng) * STEP_FRACTION;
  return { ...bus, lat: newLat, lng: newLng };
}
