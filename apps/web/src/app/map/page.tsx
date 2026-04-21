import BusMap from '../../components/map/Map';

export default function MapPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Live Bus Tracking</h1>
      <BusMap />
    </main>
  );
}
