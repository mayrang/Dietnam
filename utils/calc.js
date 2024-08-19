export function getCircleCoordinates(lon, lat, radiusM, numPoints = 65) {
  const earthRadius = 6371000; // 지구 반경 (미터 단위)
  const coordinates = [[]];

  const latRad = toRadians(lat);
  const lonRad = toRadians(lon);

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;

    const latPoint = Math.asin(
      Math.sin(latRad) * Math.cos(radiusM / earthRadius) +
        Math.cos(latRad) * Math.sin(radiusM / earthRadius) * Math.cos(angle)
    );

    const lonPoint =
      lonRad +
      Math.atan2(
        Math.sin(angle) * Math.sin(radiusM / earthRadius) * Math.cos(latRad),
        Math.cos(radiusM / earthRadius) - Math.sin(latRad) * Math.sin(latPoint)
      );

    const latPointDeg = toDegrees(latPoint);
    const lonPointDeg = toDegrees(lonPoint);

    coordinates[0].push([lonPointDeg, latPointDeg]);
  }

  return coordinates;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

export function calculateTotalDistance(coords) {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const earthRadiusKm = 6371; // 지구의 반지름(km)

  let totalDistance = 0;

  for (let i = 1; i < coords.length; i++) {
    const [prevLon, prevLat] = coords[i - 1];
    const [currLon, currLat] = coords[i];

    const dLat = toRadians(currLat - prevLat);
    const dLon = toRadians(currLon - prevLon);

    const lat1 = toRadians(prevLat);
    const lat2 = toRadians(currLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;
    totalDistance += distance;
  }

  return totalDistance; // 총 이동거리(km)
}
