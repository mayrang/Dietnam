"use client";
// import { Button } from "antd";
// import AfterInstallation from "components/AfterInstallation";
// import OverlayLoadingCustom from "components/Common/OverlayLoadingCustom";

import { useEffect, useState, useRef } from "react";
import { getCircleCoordinates, getDistance, getFinDist } from "@/utils/calc";
import "./page.module.css";
import { supabase } from "@/supabase/supabase";
import { Camera } from "react-camera-pro";
const HomePage = () => {
  const [currentPosition, setCurrentPosition] = useState();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const [recording, setRecording] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [watchId, setWatchId] = useState(-1);
  const [currentMarker, setCurrentMarker] = useState();
  const [coords, setCoords] = useState([]);
  const [lineId, setLineId] = useState(0);
  const [step, setStep] = useState(0);
  const [startImage, setStartImage] = useState();
  const [isStartCamera, setIsStartCamera] = useState(false);

  const startCamera = useRef(null);
  const finishCamera = useRef(null);

  const onStartCamera = () => {
    setStartImage(startCamera.current.takePhoto());
    setIsStartCamera(false);
  };

  //자동 레코드
  const locationAutoButtenListener = async (e) => {
    e.preventDefault();
    console.log("start");

    if (navigator.geolocation) {
      setRecording(true);
      try {
        let prev_id = null;
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

            console.log(position, "position");
            if (before_record !== null) {
              const dist = getDistance({
                lat1: before_record.latitude,
                lon1: before_record.longitude,
                lat2: new_record.latitude,
                lon2: new_record.longitude,
              });

              // if (dist < 0.01) {
              //   updateFlag = false;
              // }
            }
            if (updateFlag) {
              setCoords(new_record);
              before_record = new_record;

              setLocationList((locationList) => [...locationList, new_record]);
              if (map && currentMarker) {
                map.setCenter([
                  position.coords.longitude,
                  position.coords.latitude,
                ]);
                currentMarker.setLngLat([
                  position.coords.longitude,
                  position.coords.latitude,
                ]);

                if (prev_id) {
                  map.removeLayer(`currentCircle-${prev_id}`);
                }

                const randomId = Math.floor(Math.random() * 100000000);

                await map.addSource(`currentCircle-${randomId}`, {
                  type: "geojson",
                  data: {
                    type: "FeatureCollection",
                    features: [
                      {
                        type: "Feature",
                        properties: {},
                        geometry: {
                          coordinates: getCircleCoordinates(
                            position.coords.longitude,
                            position.coords.latitude,
                            position.coords.accuracy
                          ),
                          type: "Polygon",
                        },
                      },
                    ],
                  },
                });

                map.addLayer({
                  id: `currentCircle-${randomId}`,
                  type: "fill",
                  source: `currentCircle-${randomId}`,
                  paint: {
                    "fill-outline-color": "#e74c3c",
                    "fill-opacity": 0.3,
                    //"fill-stroke-width": 2,
                    "fill-color": "#3498db",
                  },
                });
                prev_id = randomId;
              }
            }
          },
          (err) => {
            console.log(err);
            throw err;
          },
          {
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 5000,
          }
        );

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
      setRecording(false);
      if (watchId !== -1) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(-1);
        const json = {
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
        };
        console.log(locationList);

        await map.addSource(`directions-${lineId}`, json);
        map.addLayer({
          id: `router-${lineId}`,
          type: "line",
          source: `directions-${lineId}`,
          paint: {
            "line-color": "#e74c3c",
            "line-width": 8,
          },
        });

        setLineId((prev) => prev + 1);
        setLocationList([]);
        const { data } = await supabase.from("route").insert([
          {
            route: json,
            username: "mayrang",
          },
        ]);
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
      {step === 0 && (
        <>
          {isStartCamera ? (
            <div className="relative">
              <Camera className="h-24" ref={startCamera} />
              <img src={startImage} alt="Taken photo" />
              <button className="z-10 absolute" onClick={onStartCamera}>
                Take photo
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setIsStartCamera(true)}>사진 찍기</button>
              <img src={startImage} alt="Taken photo" />
            </>
          )}
        </>
      )}
      {step === 1 && (
        <>
          {recording === false && (
            <>
              <button onClick={locationAutoButtenListener}>측정시작</button>
            </>
          )}
          {recording === true && (
            <button onClick={finishAutoRecordButtonListener}>측정종료</button>
          )}
          {...showLocationList}
        </>
      )}
    </>
  );
};

export default HomePage;
