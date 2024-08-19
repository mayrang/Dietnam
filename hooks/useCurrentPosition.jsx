"use client";
import { useEffect, useState } from "react";

export default function useCurrentPosition() {
  const [currentPosition, setCurrentPosition] = useState();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(
            `위도: ${latitude}, 경도: ${longitude}, 정확도: ${accuracy}미터`
          );
          setCurrentPosition([longitude, latitude]);
        },
        (error) => {
          console.error(`위치 정보를 가져올 수 없습니다: ${error.message}`);
        },
        {
          enableHighAccuracy: true, // 정확도 우선 모드
          timeout: 10000, // 10초 이내에 응답 없으면 에러 발생
          maximumAge: 0, // 항상 최신 위치 정보 수집
        }
      );
    }
  }, []);

  return currentPosition;
}
