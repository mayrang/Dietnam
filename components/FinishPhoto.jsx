import { Camera } from "react-camera-pro";
import { useRef, useState } from "react";
import { dataURIToFile } from "../utils/file";
import { supabase } from "../supabase/supabase";
import { useMakingStore, useMapStore, useStepStore } from "../store/making";
import FinishPlace from "./FinishPlace";
import CameraIcon from "./icons/CameraIcon";

export default function FinishPhoto() {
  const {
    setFinishImage,
    route: { json },
  } = useMakingStore();

  const { setStep } = useStepStore();
  const [isFinishCamera, setIsFinishCamera] = useState(false);

  const finishCamera = useRef(null);
  const onFinishCamera = async () => {
    setIsFinishCamera(false);
    const random = Math.floor(Math.random() * 100000000);
    const filename = `finishImage-${random}`;
    const bucket = "wemap-route-image";

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

    setStep("checkFinishPhoto");
  };

  return isFinishCamera ? (
    <div className="fixed top-0 left-0 right-0 bottom-0">
      <Camera ref={finishCamera} facingMode="environment" />

      <button
        className="z-10 absolute bottom-5 left-1/2 -translate-x-1/2 bg-transparent"
        onClick={onFinishCamera}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="50"
          height="50"
          fill="white"
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
      <FinishPlace />
      <div className="flex w-full  items-center gap-2">
        <button
          onClick={() => setIsFinishCamera(true)}
          className=" border-2   cursor-pointer w-full h-24 rounded-md border-solid border-gray-300 flex justify-center items-center shadow"
        >
          <CameraIcon />
        </button>
      </div>
    </div>
  );
}
