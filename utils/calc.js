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

export function calculateCenterAndZoom(coords) {
  if (coords.length === 0) {
    return { center: [0, 0], zoom: 1 }; // 빈 배열 처리
  }

  let minLat = coords[0][1],
    maxLat = coords[0][1];
  let minLon = coords[0][0],
    maxLon = coords[0][0];

  coords.forEach(([lon, lat]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
  });

  const center = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];

  // 단순 줌 레벨 계산 (이건 매우 단순화된 예시)
  const latRange = maxLat - minLat;
  const lonRange = maxLon - minLon;
  const maxRange = Math.max(latRange, lonRange);

  let zoom;
  if (maxRange > 60) zoom = 4;
  else if (maxRange > 10) zoom = 7; // 국가 크기
  else if (maxRange > 1) zoom = 8; // 도시 크기
  else if (maxRange > 0.1) zoom = 10; // 지역 크기
  else if (maxRange > 0.01) zoom = 11;
  else if (maxRange > 0.001) zoom = 13;
  else zoom = 15; // 매우 가까운 거리

  return { center, zoom };
}

export function adjustCoordinatesForDirection(start, end) {
  const [startLon, startLat] = start;
  const [endLon, endLat] = end;

  let horizontalDirection = "";
  let verticalDirection = "";

  // 왼쪽에서 오른쪽으로 가는 경우 (경도 증가)
  if (endLon > startLon) {
    horizontalDirection = "right";
  }
  // 오른쪽에서 왼쪽으로 가는 경우 (경도 감소)
  else if (endLon < startLon) {
    horizontalDirection = "left";
  }

  // 위에서 아래로 가는 경우 (위도 감소)
  if (endLat > startLat) {
    verticalDirection = "up";
  }
  // 아래에서 위로 가는 경우 (위도 증가)
  else if (endLat < startLat) {
    verticalDirection = "down";
  }

  return { horizontalDirection, verticalDirection };
}

export function calculateDistance(coord1, coord2) {
  // 지구의 반지름 (킬로미터)
  const R = 6371;
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  // 위도와 경도를 라디안으로 변환
  const lat1Rad = lat1 * (Math.PI / 180);
  const lon1Rad = lon1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  const lon2Rad = lon2 * (Math.PI / 180);

  // 두 위도와 두 경도의 차이 계산
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine 공식을 사용하여 거리 계산
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 거리 계산
  const distance = R * c;

  return distance;
}
