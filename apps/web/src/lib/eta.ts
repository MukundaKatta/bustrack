const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateEtaMinutes(
  busLat: number,
  busLng: number,
  stopLat: number,
  stopLng: number,
  avgSpeedKmh = 30,
): number {
  const distanceKm = haversineDistanceKm(busLat, busLng, stopLat, stopLng);
  return Math.max(1, Math.round((distanceKm / avgSpeedKmh) * 60));
}
