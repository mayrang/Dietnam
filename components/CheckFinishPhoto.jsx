"use client";
import Image from "next/image";
import FinishPlace from "./FinishPlace";
import { useMakingStore, useStepStore } from "../store/making";
import { useEffect } from "react";
import InputRouteName from "./InputRouteName";
export default function CheckFinishPhoto() {
  const {
    route: { finishImage, routeName },
    route,
  } = useMakingStore();
  const { setStep } = useStepStore();

  useEffect(() => {
    if (!finishImage) {
      setStep("finishPhoto");
    }
  }, [finishImage]);

  const handleSave = () => {
    if (routeName === "") {
      alert("Please input route name");
    }
    console.log(route);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <InputRouteName />
      <FinishPlace />
      <div className="flex w-full  items-center gap-2">
        <div className="size-8 " />
        <div className=" border-2   cursor-pointer w-full h-[250px] border-solid border-black flex justify-center items-center">
          <Image
            src={finishImage}
            className="w-full h-full object-cover"
            alt="start image"
            width={300}
            height={400}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-7 font-bold cursor-pointer py-2 border-2 border-solid border-black "
      >
        Save
      </button>
    </div>
  );
}
