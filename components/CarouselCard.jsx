"use client";

import { useEffect, useRef } from "react";
import { calculateCenterAndZoom } from "../utils/calc";
import DataCard from "./DataCard";
export default function CarouselCard({ data }) {
  const mapContainer = useRef(null);

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
        if (data) {
          const { center, zoom } = calculateCenterAndZoom(
            data.route.data.features[0].geometry.coordinates
          );

          // 지도를 초기화하는 함수
          const initializeMap = () => {
            const map = new window.wemapgl.WeMap({
              container: mapContainer.current,
              key: "YZkGTFFioePZWDhTolBEFiRFJHDbanHW",
              style: "bright",
              center: center,
              urlController: false,
              zoom: zoom,
            });
            const adjustmentFactorMarker =
              zoom < 10 ? 0.005 : zoom < 14 ? 0.001 : 0.0002;

            var startEl = document.createElement("div");
            startEl.className = "start-marker";

            // add marker to map
            const startMarker = new wemapgl.Marker(startEl)
              .setLngLat([
                data.start_position.data[0],
                data.start_position.data[1] + adjustmentFactorMarker,
              ])
              .addTo(map);

            var finishEl = document.createElement("div");
            finishEl.className = "finish-marker";

            // add marker to map
            const finishMarker = new wemapgl.Marker(finishEl)
              .setLngLat([
                data.finish_position.data[0],
                data.finish_position.data[1] + adjustmentFactorMarker,
              ])
              .addTo(map);

            map.on("load", function () {
              map.addSource(`directions`, data.route);
              map.addLayer({
                id: `router`,
                type: "line",
                source: `directions`,
                paint: {
                  "line-color": "#e74c3c",
                  "line-width": 8,
                },
              });
            });
          };

          // 초기화 후 currentPosition이 업데이트되었는지 확인
          const intervalId = setInterval(() => {
            clearInterval(intervalId);

            initializeMap();
          }, 0);
        }
      })
      .catch((err) => {
        console.log(err);
        console.error("Script loading failed! Handle this error");
      });
  }, [JSON.stringify(data)]);

  return (
    <a
      href={`/detail/${data.id}`}
      className="w-full gap-3 rounded-lg mb-2  flex-1 border-2 border-solid border-gray-200 shadow-md p-4 flex flex-col items-center"
    >
      <div className="flex-1 w-full rounded-xl overflow-hidden shadow-lg">
        <div
          id="mapContainer"
          ref={mapContainer}
          className="h-full w-full"
        ></div>
      </div>    
      <DataCard data={data} />
    </a>
  );
}
