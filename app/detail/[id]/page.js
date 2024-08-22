"use client";

import { getDataById } from "../../../supabase/supabase";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDetailStore } from "../../../store/detail";
import DetailBottom from "../../../components/DetailBottom";
import {
  adjustCoordinatesForDirection,
  calculateCenterAndZoom,
} from "../../../utils/calc";
import useCurrentPosition from "../../../hooks/useCurrentPosition";
import { useCurrentMarkerStore, useMapStore } from "../../../store/making";
export default function Detail() {
  const { id } = useParams();
  const { data, setData } = useDetailStore();
  const mapContainer = useRef(null);
  const currentPosition = useCurrentPosition();
  const { setCurrentMarker } = useCurrentMarkerStore();
  const { map, setMap } = useMapStore();
  useEffect(() => {
    getDataById(id).then((result) => {
      setData(result[0]);
      console.log(result[0]);
    });
  }, [id, setData]);

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
        if (data && currentPosition) {
          const { center, zoom } = calculateCenterAndZoom(
            data.route.data.features[0].geometry.coordinates
          );
          console.log("center", center, zoom);
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

            var el = document.createElement("div");
            el.className = "current-marker";

            // add marker to map
            const marker = new wemapgl.Marker(el)
              .setLngLat(currentPosition)
              .addTo(map);
            setMap(map);
            setCurrentMarker(marker);

            const { horizontalDirection, verticalDirection } =
              adjustCoordinatesForDirection(
                data.start_position.data,
                data.finish_position.data
              );
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

            var startImageEl = document.createElement("div");
            startImageEl.className = "start-image";
            startImageEl.style.backgroundImage = `url(${
              data.start_image ?? ""
            })`;

            startImageEl.style.borderRadius = "20%"
            startImageEl.style.overflow = "hidden"
            startImageEl.style.boxShadow = "0 20px 20px -5px rgb(0 0 0 / 0.3)"

            var finishImageEl = document.createElement("div");
            finishImageEl.className = "finish-image";
            finishImageEl.style.backgroundImage = `url(${
              data.finish_image ?? ""
            })`;

            finishImageEl.style.borderRadius = "20%"
            finishImageEl.style.overflow = "hidden"
            finishImageEl.style.boxShadow = "0 20px 20px -5px rgb(0 0 0 / 0.3)"

            if (horizontalDirection === "right") {
              startImageEl.style.right = "20px";
              finishImageEl.style.left = "20px";
            } else {
              startImageEl.style.left = "20px";
              finishImageEl.style.right = "20px";
            }

            if (verticalDirection === "up") {
              startImageEl.style.top = "20px";
              finishImageEl.style.bottom = "20px";
            } else {
              startImageEl.style.bottom = "20px";
              finishImageEl.style.top = "20px";
            }
            finishEl.appendChild(finishImageEl);
            startEl.appendChild(startImageEl);

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
      .catch(() => {
        console.error("Script loading failed! Handle this error");
      });
  }, [JSON.stringify(data), currentPosition]);
  return (
    data && (
      <>
        <div className="h-[calc(100svh-54px)] w-full">
          <div
            id="mapContainer"
            ref={mapContainer}
            className="h-full w-full"
          ></div>
          <DetailBottom />
        </div>
      </>
    )
  );
}
