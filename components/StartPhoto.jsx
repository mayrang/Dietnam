"use client";
import { Camera } from "react-camera-pro";
import StartPlace from "./StartPlace";
import { useEffect, useRef, useState } from "react";
import { dataURIToFile } from "../utils/file";
import { supabase } from "../supabase/supabase";
import { useMakingStore, useMapStore, useStepStore } from "../store/making";
import useCurrentPosition from "../hooks/useCurrentPosition";
import CameraIcon from "./icons/CameraIcon";

export default function StartPhoto() {
  const startCamera = useRef(null);
  const { setStartImage, setStartPosition } = useMakingStore();
  const [isStartCamera, setIsStartCamera] = useState(false);
  const { setStep } = useStepStore();
  const { map } = useMapStore();
  const currentPosition = useCurrentPosition();

  console.log("is", isStartCamera);
  const onStartCamera = async () => {
    setIsStartCamera(false);
    const random = Math.floor(Math.random() * 100000000);
    const filename = `startImage-${random}`;
    const bucket = "wemap-route-image";
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
    setStep("checkStartPhoto");
  };

  useEffect(() => {
    if (map && currentPosition) {
      map.on("load", () => {
        var el = document.createElement("div");
        el.className = "start-marker";

        // add marker to map
        const marker = new wemapgl.Marker(el)
          .setLngLat(currentPosition)
          .addTo(map);
      });
      setStartPosition(currentPosition);
    }
  }, [map, currentPosition, setStartPosition]);
  return isStartCamera ? (
    <div className="fixed top-0 left-0 right-0 bottom-0">
      <Camera ref={startCamera} facingMode="environment" />

      <button
        className="z-10 absolute bottom-5 left-1/2 -translate-x-1/2 bg-transparent"
        onClick={onStartCamera}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="36"
          height="36"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="14.31" x2="20.05" y1="8" y2="17.94" />
          <line x1="9.69" x2="21.17" y1="8" y2="8" />
          <line x1="7.38" x2="13.12" y1="12" y2="2.06" />
          <line x1="9.69" x2="3.95" y1="16" y2="6.06" />
          <line x1="14.31" x2="2.83" y1="16" y2="16" />
          <line x1="16.62" x2="10.88" y1="12" y2="21.94" />
        </svg>
      </button>
    </div>
  ) : (
    <div className="flex flex-col gap-4 items-center">
      <StartPlace />
      <div className="flex w-full  items-center gap-2">
        <button
          onClick={() => setIsStartCamera(true)}
          className=" border-2   cursor-pointer w-full h-20 rounded-md border-solid border-gray-300 flex justify-center items-center shadow"
        >
          <CameraIcon />
        </button>
      </div>
    </div>
  );
}
