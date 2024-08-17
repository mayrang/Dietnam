export function getDistance({ lat1, lon1, lat2, lon2 }) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    let radlat1 = (Math.PI * lat1) / 180;
    let radlat2 = (Math.PI * lat2) / 180;
    let theta = lon1 - lon2;
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    //KM로 변환
    return dist;
  }
}

export function getFinDist(locationList) {
  const lastIdx = locationList.length - 1;
  //마지막이랑 처음이랑 길이차이가 많이나면 안됨.100meter만 허용
  const finDist = getDistance({
    lat1: locationList[0].latitude,
    lon1: locationList[0].longitude,
    lat2: locationList[lastIdx].latitude,
    lon2: locationList[lastIdx].longitude,
  });
  return finDist;
}
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
