/**
 * Geospatial Geodesic & Road Stretch Distance Engine (Haversine Algorithm)
 * Used to calculate audited highway stretch (km), GSD (Ground Sampling Distance),
 * and trajectory lengths from GeoJSON LineString coordinates.
 */

// Earth's mean spherical radius in kilometers (WGS-84 / IUGG standard)
export const EARTH_RADIUS_KM = 6371.0088;

/**
 * Converts degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0;
}

/**
 * Calculates the great-circle distance between two GPS waypoints
 * using the Haversine formula.
 *
 * @param coord1 [longitude, latitude] in decimal degrees
 * @param coord2 [longitude, latitude] in decimal degrees
 * @returns Geodesic distance in Kilometers
 */
export function haversineDistanceKm(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLng = degreesToRadians(lng2 - lng1);

  const phi1 = degreesToRadians(lat1);
  const phi2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates the total length of a GeoJSON LineString coordinate array.
 *
 * @param coordinates Array of [longitude, latitude] pairs
 * @returns Total distance in Kilometers
 */
export function calculateLineStringLengthKm(coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length < 2) return 0;

  let totalDistanceKm = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistanceKm += haversineDistanceKm(coordinates[i], coordinates[i + 1]);
  }

  return Number(totalDistanceKm.toFixed(3));
}

/**
 * Calculates cumulative audited stretch across multiple GeoJSON road features.
 *
 * @param roads List of road features with coordinates
 * @returns Total audited distance in Kilometers
 */
export function calculateTotalAuditedStretchKm(
  roads: Array<{ coordinates: [number, number][] }>
): number {
  if (!roads || roads.length === 0) return 0;

  const total = roads.reduce((sum, road) => {
    return sum + calculateLineStringLengthKm(road.coordinates);
  }, 0);

  return Number(total.toFixed(2));
}

/**
 * Converts Aerial Drone GSD (Ground Sampling Distance) in meters/pixel
 * based on flight altitude and camera field-of-view (FOV).
 *
 * @param altitudeMeters Drone flight altitude above ground level (m)
 * @param cameraFovDegrees Horizontal camera field of view (deg)
 * @param imageWidthPixels Image sensor width in pixels
 * @returns GSD in meters per pixel
 */
export function calculateGSD(
  altitudeMeters: number,
  cameraFovDegrees: number = 84,
  imageWidthPixels: number = 3840
): number {
  const fovRad = degreesToRadians(cameraFovDegrees);
  const groundWidthMeters = 2.0 * altitudeMeters * Math.tan(fovRad / 2.0);
  return groundWidthMeters / imageWidthPixels;
}
