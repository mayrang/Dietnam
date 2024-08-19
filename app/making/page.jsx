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
import BottomArea from "../../components/BottomArea";
import { useCurrentMarkerStore, useMapStore } from "../../store/making";
import useCurrentPosition from "../../hooks/useCurrentPosition";

const MakingPage = () => {
  const { currentMarker, setCurrentMarker } = useCurrentMarkerStore();
  const { map, setMap } = useMapStore();

  const currentPosition = useCurrentPosition();
  const mapContainer = useRef(null);

  const [recording, setRecording] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [watchId, setWatchId] = useState(-1);

  const [coords, setCoords] = useState([]);
  const [lineId, setLineId] = useState(0);
  const [step, setStep] = useState(0);

  const [isFinishCamera, setIsFinishCamera] = useState(false);
  const [finishImage, setFinishImage] = useState();

  const finishCamera = useRef(null);
  const [json, setJson] = useState();
  const router = useRouter();

  const bucket = "wemap-route-image";

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
    LoadScript()
      .then(() => {
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

            var el = document.createElement("div");
            el.className = "current-marker";

            // add marker to map
            const marker = new wemapgl.Marker(el)
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
        <div className="h-[calc(100vh-66px)] relative  w-full">
          <div
            id="mapContainer"
            ref={mapContainer}
            className="h-full w-full"
          ></div>
          <BottomArea />
        </div>
      </div>
      {/* {step === 0 && (
        <>
          
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
      )} */}
    </>
  );
};

export default MakingPage;
