import { Camera } from "react-camera-pro";
import { useRef, useState } from "react";
import { dataURIToFile } from "../utils/file";
import { supabase } from "../supabase/supabase";
import { useMakingStore, useMapStore, useStepStore } from "../store/making";
import FinishPlace from "./FinishPlace";
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

    // const { data } = await supabase
    //   .from("route")
    //   .insert([
    //     {
    //       route: json,
    //       username: "mayrang",
    //       start_image: startImage,
    //       finish_image: finishUrl.data.publicUrl,
    //     },
    //   ])
    //   .select();

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
      <FinishPlace />
      <div className="flex w-full  items-center gap-2">
        <div className="size-8 " />
        <button
          onClick={() => setIsFinishCamera(true)}
          className=" border-2   cursor-pointer w-full h-20 border-solid border-black flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
