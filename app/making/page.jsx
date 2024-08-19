"use client";

import { useEffect, useState, useRef } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import "./page.module.css";

import BottomArea from "../../components/BottomArea";
import { useCurrentMarkerStore, useMapStore } from "../../store/making";
import useCurrentPosition from "../../hooks/useCurrentPosition";

const MakingPage = () => {
  const { currentMarker, setCurrentMarker } = useCurrentMarkerStore();
  const { map, setMap } = useMapStore();

  const currentPosition = useCurrentPosition();
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
        console.log("Script loading failed! Handle this error");
      });
  }, [currentPosition]);

  return (
    <>
      <div>
        <div className="h-[calc(100svh-54px)] relative  w-full">
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
