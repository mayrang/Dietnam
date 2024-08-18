"use client";

import { useEffect, useState, useRef } from "react";
import {
  getCircleCoordinates,
  getDistance,
  getFinDist,
} from "../../utils/calc";
import "./page.module.css";
import { supabase } from "../../supabase/supabase";
import { Camera } from "react-camera-pro";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dataURIToFile } from "../../utils/file";

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
  const [isFinishCamera, setIsFinishCamera] = useState(false);
  const [finishImage, setFinishImage] = useState();
  const startCamera = useRef(null);
  const finishCamera = useRef(null);
  const [json, setJson] = useState();
  const router = useRouter();

  const bucket = "wemap-route-image";

  const onStartCamera = async () => {
    setIsStartCamera(false);
    const random = Math.floor(Math.random() * 100000000);
    const filename = `startImage-${random}`;

    let image = startCamera.current.takePhoto();

    const file = dataURIToFile(image, filename);
    console.log(startCamera.current);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file);
    if (error) {
      console.error("upload start image error", error);
      return;
    }
    const startUrl = supabase.storage.from(bucket).getPublicUrl(filename);
    console.log(startUrl.data.publicUrl);
    setStartImage(startUrl.data.publicUrl);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const onFinishCamera = async () => {
    setIsFinishCamera(false);
    const random = Math.floor(Math.random() * 100000000);
    const filename = `finishImage-${random}`;

    let image = finishCamera.current.takePhoto();

    const file = dataURIToFile(image, filename);
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file);
    if (error) {
      console.error("upload finish image error", error);
      return;
    }
    const finishUrl = supabase.storage.from(bucket).getPublicUrl(filename);
    setFinishImage(finishUrl.data.publicUrl);

    const { data } = await supabase
      .from("route")
      .insert([
        {
          route: json,
          username: "mayrang",
          start_image: startImage,
          finish_image: finishUrl.data.publicUrl,
        },
      ])
      .select();

    router.replace(`/detail/${data[0].id}`);
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
        setJson(json);
        setLineId((prev) => prev + 1);
        setLocationList([]);
        setStep(2);
      }
    } catch (err) {
      alert(err.message);
    }
  };

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
            <>
              <Camera ref={startCamera} facingMode="environment" />

              <button
                className="z-10 absolute bottom-5 left-1/2 -translate-x-1/2"
                onClick={onStartCamera}
              >
                Take photo
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsStartCamera(true)}>사진 찍기</button>
              <Image
                className="absolute z-4 w-full overflow-hidden "
                width={400}
                height={500}
                src={startImage}
                alt="Taken photo"
              />
              <button onClick={nextStep}>다음 스텝</button>
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
        </>
      )}
      {step === 2 && (
        <>
          {isFinishCamera ? (
            <>
              <Camera ref={finishCamera} facingMode="environment" />

              <button
                className="z-10 absolute bottom-5 left-1/2 -translate-x-1/2"
                onClick={onFinishCamera}
              >
                Take photo
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsFinishCamera(true)}>사진 찍기</button>
              <Image
                className="absolute z-4 w-full overflow-hidden "
                width={400}
                height={500}
                src={finishImage}
                alt="Taken photo"
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
