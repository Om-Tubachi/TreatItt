export interface RouteResult {
  coordinates: [number, number][]; // [lng, lat] pairs, GeoJSON order
  distanceMeters: number;
  durationSeconds: number;
}

// public demo server — fine for building/testing, but not licensed for production
// traffic. Swap to OpenRouteService (free-tier API key) before shipping this.
const OSRM_BASE = 'https://router.project-osrm.org';

export async function fetchRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<RouteResult | null> {
  const url = `${OSRM_BASE}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;

    return {
      coordinates: route.geometry.coordinates,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
    };
  } catch {
    return null;
  }
}