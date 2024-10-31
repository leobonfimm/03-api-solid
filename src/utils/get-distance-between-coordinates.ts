export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  const EARTH_RADIUS_KM = 6371; // Raio médio da Terra em km

  const fromLatRad = (Math.PI * from.latitude) / 180;
  const toLatRad = (Math.PI * to.latitude) / 180;
  const deltaLatRad = ((to.latitude - from.latitude) * Math.PI) / 180;
  const deltaLonRad = ((to.longitude - from.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(fromLatRad) *
      Math.cos(toLatRad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;

  return distance;
}
