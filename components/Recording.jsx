"use client";
import { useEffect, useState } from "react";
import {
  useCurrentMarkerStore,
  useMakingStore,
  useMapStore,
  useRecordingStore,
  useStepStore,
  useTimeStore,
} from "../store/making";
import InputRouteName from "./InputRouteName";
import Stop from "./icons/Stop";
import { getCircleCoordinates } from "../utils/calc";
export default function Recording() {
  const { setJson, setFinishPosition } = useMakingStore();
  const { recording, setRecording } = useRecordingStore();
  const [watchId, setWatchId] = useState(-1);
  const [lineId, setLineId] = useState(0);
  const { map } = useMapStore();
  const { setStep } = useStepStore();
  const { currentMarker } = useCurrentMarkerStore();
  const [locationList, setLocationList] = useState([]);
  const { setFinishTime } = useTimeStore();

  useEffect(() => {
    if (recording) {
      locationAutoButtenListener();
    }
  }, [recording]);

  //자동 레코드
  const locationAutoButtenListener = async () => {
    if (navigator.geolocation) {
      setRecording(true);
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

            console.log(position, "position");
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
        var el = document.createElement("div");
        el.className = "finish-marker";

        // add marker to map
        const marker = new wemapgl.Marker(el)
          .setLngLat(locationList[locationList.length - 1])
          .addTo(map);
        setJson(json);
        setLineId((prev) => prev + 1);
        setFinishPosition(locationList[locationList.length - 1]);
        setLocationList([]);
        setFinishTime(Date.now());
        setStep("finishPhoto");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <InputRouteName />
      <button onClick={finishAutoRecordButtonListener} className="mt-4">
        <Stop />
      </button>
    </div>
  );
}
