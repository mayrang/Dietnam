"use client";
// import { Button } from "antd";
// import AfterInstallation from "components/AfterInstallation";
// import OverlayLoadingCustom from "components/Common/OverlayLoadingCustom";

import { useEffect, useState, useRef } from "react";
import { getDistance, getFinDist } from "@/utils/calc";
import "./page.module.css";
const HomePage = () => {
  const [currentPosition, setCurrentPosition] = useState();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const [coords, setcoords] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [watchId, setWatchId] = useState(-1);
  const [currentMarker, setCurrentMarker] = useState();
  const [recording, setRecording] = useState(false); //기록 중
  const [readyRecord, setReadyRecord] = useState(false); //시작가능
  const [userCheck, setUserCheck] = useState(false); //유저 확인
  const [lineId, setLineId] = useState(0);
  //이전 기록 리셋
  const resetButtonHandler = async (e) => {
    e.preventDefault();
    try {
      setReadyRecord(true);

      alert("기록 삭제 완료");
    } catch (err) {
      alert(err.message);
    }
  };

  //자동 레코드
  const locationAutoButtenListener = async (e) => {
    e.preventDefault();
    console.log("start");
    if (navigator.geolocation) {
      try {
        setRecording(false);

        let before_record = null;

        console.log(navigator.geolocation);
        const newId = navigator.geolocation.watchPosition(
          async (position) => {
            let updateFlag = true;
            const new_record = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            //시작

            console.log(before_record, new_record);
            if (before_record !== null) {
              const dist = getDistance({
                lat1: before_record.latitude,
                lon1: before_record.longitude,
                lat2: new_record.latitude,
                lon2: new_record.longitude,
              });

              //이동거리가 5m미만이면 안바뀜
              // if (dist < 0.001) {
              // updateFlag = false;
              // }
            }
            if (updateFlag) {
              setcoords(new_record);
              before_record = new_record;
              setLineId((prev) => prev + 1);
              setLocationList((locationList) => [...locationList, new_record]);
              if (map && currentMarker) {
                console.log(new_record, "in map");
                map.setCenter([
                  position.coords.longitude,
                  position.coords.latitude,
                ]);
                currentMarker.setLngLat([
                  position.coords.longitude,
                  position.coords.latitude,
                ]);
              }
            }
          },
          (err) => {
            console.log(err);
            throw err;
          },
          {
            enableHighAccuracy: false,
            maximumAge: 2000,
            timeout: 5000,
          }
        );
        setRecording(true);

        setWatchId(newId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("GPS문제, 기록불가");
    }
  };
  //자동 종료
  const finishAutoRecordButtonListener = async (e) => {
    e.preventDefault();
    try {
      if (watchId !== -1) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(-1);
        const finDist = getFinDist(locationList);
        let finish = 1;
        // if (locationList.length < 3 || finDist > 0.2) {
        //finish = 0;
        // }

        if (finish === 0) {
          alert(
            "정상적인 종료 조건이 아닙니다.(3곳 이상 방문, 시작점, 마지막점 200m이내)"
          );
        }
        console.log(locationList);

        await map.addSource("directions", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  coordinates: locationList,
                  type: "LineString",
                },
              },
            ],
          },
        });
        map.addLayer({
          id: `router-${lineId}`,
          type: "line",
          source: "directions",
          paint: {
            "line-color": "#e74c3c",
            "line-width": 8,
          },
        });

        setLocationList([]);
        //setRecordcode(-1);
        setReadyRecord(true);
        setRecording(false);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const locationToString = (coord, idx) => (
    <div key={idx}>
      latitude : {coord[0]} & longitude : {coord[1]}
    </div>
  );

  const showLocationList = locationList.map((coord, idx) =>
    locationToString(coord, idx)
  );

  const LoadScript = () => {
    const script = document.createElement("script");
    console.log(123);
    script.src = "/wemap-gl.js";
    document.head.appendChild(script);
    return new Promise((res, rej) => {
      script.onload = () => res();
      script.onerror = () => rej();
    });
  };

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

  useEffect(() => {
    LoadScript()
      .then(() => {
        console.log(456, currentPosition);
        if (currentPosition) {
          // 지도를 초기화하는 함수
          const initializeMap = () => {
            const map = new window.wemapgl.WeMap({
              container: mapContainer.current,
              key: "YZkGTFFioePZWDhTolBEFiRFJHDbanHW",
              style: "bright",
              center: currentPosition,
              zoom: 13,
            });

            console.log("check", currentPosition);
            const marker = new window.wemapgl.Marker()
              .setLngLat(currentPosition)
              .addTo(map);

            // map.addTo(currentPositionMarker);
            console.log(marker, "markder");
            map.on("click", (e) => {
              console.log(e.lngLat);
            });
            console.log("map", map);
            setMap(map);
            setCurrentMarker(marker);
          };

          // 초기화 후 currentPosition이 업데이트되었는지 확인
          const intervalId = setInterval(() => {
            clearInterval(intervalId);

            initializeMap();
          }, 0);
        }
      })
      .catch(() => {
        console.error("Script loading failed! Handle this error");
      });
  }, [currentPosition]);

  return (
    <>
      <div>
        <div className="h-[calc(100vh-150px)] w-full">
          <div
            id="mapContainer"
            ref={mapContainer}
            className="h-full w-full"
          ></div>
        </div>
      </div>
      <button onClick={locationAutoButtenListener}>측정시작</button>
      <button onClick={finishAutoRecordButtonListener}>측정종료</button>
      {...showLocationList}
    </>
  );
};

export default HomePage;
