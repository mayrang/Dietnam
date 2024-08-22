"use client";
import { useState } from "react";
import { useDetailStore } from "../store/detail";
import FinishPlace from "./FinishPlace";
import StartPlace from "./StartPlace";
import Clock from "./icons/Clock";
import { useCurrentMarkerStore, useMapStore } from "../store/making";
import { getCircleCoordinates } from "../utils/calc";
import Image from "next/image";
import Walking from "./icons/Walking";
export default function DetailBottom() {
  const { data } = useDetailStore();
  const { currentMarker, setCurrentMarker } = useCurrentMarkerStore();
  const { map, setMap } = useMapStore();
  const [watchId, setWatchId] = useState(-1);
  const [lineId, setLineId] = useState(0);
  const [recording, setRecording] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [circleId, setCircleId] = useState();
  //자동 레코드
  const locationAutoButtenListener = async () => {
    if (navigator.geolocation) {
      setRecording(true);
      if (map && lineId) {
        map.removeLayer(`detail-directions-${lineId}`);
      }

      try {
        let prev_id = null;
        let before_record = null;
        const newId = navigator.geolocation.watchPosition(
          async (position) => {
            let updateFlag = true;
            const new_record = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            //시작

            if (before_record !== null) {
            }
            if (updateFlag) {
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
                setCircleId(randomId);
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

  const finishAutoRecordButtonListener = async (e) => {
    e.preventDefault();
    try {
      if (circleId) {
        map.removeLayer(`currentCircle-${circleId}`);
      }
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

        await map.addSource(`detail-directions-${lineId}`, json);
        map.addLayer({
          id: `router-${lineId}`,
          type: "line",
          source: `detail-directions-${lineId}`,
          paint: {
            "line-color": "#00D300",
            "line-width": 8,
          },
        });

        setLineId((prev) => prev + 1);

        setLocationList([]);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="absolute p-6 bottom-0 w-5/6 mx-auto left-0 bg-white z-20 right-0 rounded-t-3xl shadow-2xl">
      <div className="flex items-center gap-1 mb-2 -mt-2">
        {data?.type === "running" ? (
          <Image
            src={"/running.png"}
            width={28}
            height={28}
            alt="running icon"
          />
        ) : (
          <Walking />
        )}
        <div className="font-bold text-xl">
          {data?.type === "running" ? "Running" : "Walking"}
        </div>
      </div>
      <StartPlace />
      <div className="flex items-center">
        <div className="flex flex-col gap-[2px] items-center w-[26.5px]">
          <div className="h-3 bg-black w-0.5" />
          <div className="h-3 bg-black w-0.5" />
          <div className="h-3 bg-black w-0.5" />
        </div>
        <div className="flex-1 pl-2 flex items-center gap-1">
          <Clock />
          <div>
            {data.time ?? 0}m {" / "}
            {data.distance ?? 0}km
          </div>
        </div>
      </div>
      <FinishPlace />
      <div className="mb-2 w-full flex justify-center items-center">
        {recording ? (
          <button
            onClick={finishAutoRecordButtonListener}
            className="px-7 font-bold mt-4  py-2 cursor-pointer border-2 border-solid border-gray-200 rounded-md shadow-md "
          >
            Stop
          </button>
        ) : (
          <button
            onClick={locationAutoButtenListener}
            className="px-7 font-bold mt-4  py-2 cursor-pointer border-2 border-solid border-gray-200 rounded-md shadow-md"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
