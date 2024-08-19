"use client";

import { getDataById } from "../../../supabase/supabase";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Detail() {
  const { id } = useParams();
  const [data, setData] = useState();
  const mapContainer = useRef(null);

  useEffect(() => {
    getDataById(id).then((result) => {
      setData(result[0]);
      console.log(result[0]);
    });
  }, [id]);

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
          // 지도를 초기화하는 함수
          const initializeMap = () => {
            const map = new window.wemapgl.WeMap({
              container: mapContainer.current,
              key: "YZkGTFFioePZWDhTolBEFiRFJHDbanHW",
              style: "bright",
              center: data.route.data.features[0].geometry.coordinates[0],
              zoom: 13,
            });

            map.on("click", (e) => {
              console.log(e.lngLat);
            });
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
  }, [data]);
  return (
    <div>
      {JSON.stringify(data)}
      {/* {data && (
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
          <div>
            <div>시작 이미지</div>
            <Image
              src={data.start_image}
              alt="start image"
              width={400}
              height={500}
            />
          </div>
          <div>
            <div>도착 이미지</div>
            <Image
              src={data.finish_image}
              alt="finish image"
              width={400}
              height={500}
            />
          </div>
        </>
      )} */}
    </div>
  );
}
