"use client";
import Image from "next/image";
import StartPlace from "./StartPlace";
import {
  useMakingStore,
  useRecordingStore,
  useStepStore,
} from "../store/making";
import { useEffect, useState } from "react";

export default function CheckStartPhoto() {
  const { setType, type } = useMakingStore();
  const {
    route: { startImage },
  } = useMakingStore();
  const { setStep } = useStepStore();
  const { setRecording } = useRecordingStore();
  useEffect(() => {
    if (!startImage) {
      setStep("startPhoto");
    }
  }, [startImage]);

  const handleOptionChange = (event) => {
    console.log(event.currentTarget.value);
    setType(event.currentTarget.value);
  };

  const handleStart = () => {
    setStep("recording");

    setRecording(true);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <StartPlace />
      <div className="flex w-full  items-center gap-2">
        <div className="size-8 " />
        <div className=" border-2   cursor-pointer w-full h-[250px] border-solid border-black flex justify-center items-center">
          <Image
            src={startImage}
            className="w-full h-full object-cover"
            alt="start image"
            width={300}
            height={400}
          />
        </div>
      </div>
      <div className="flex w-full  items-center gap-2">
        <div className="size-8 " />
        <div className="rounded-lg w-full border-2 p-4 border-solid border-black ">
          <div className="mb-4">Type</div>
          <div className="flex items-center gap-4">
            <label htmlFor="walking">
              <input
                type="radio"
                className="mr-1.5"
                id="walking"
                onChange={handleOptionChange}
                name="type"
                value="walking"
              />
              Walking
            </label>
            <label htmlFor="running">
              <input
                type="radio"
                className="mr-1.5"
                id="running"
                onChange={handleOptionChange}
                name="type"
                value="running"
              />
              Running
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={handleStart}
        className="px-7 font-bold cursor-pointer py-2 border-2 border-solid border-black "
      >
        Start
      </button>
    </div>
  );
}
