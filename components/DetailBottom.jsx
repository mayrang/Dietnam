"use client";
import { useDetailStore } from "../store/detail";
import FinishPlace from "./FinishPlace";
import StartPlace from "./StartPlace";
import Clock from "./icons/Clock";

export default function DetailBottom() {
  const { data } = useDetailStore();

  return (
    <div className="absolute p-6 bottom-0 w-5/6 mx-auto left-0 bg-white z-20 right-0 rounded-t-md  border-solid border-black  border-t-2 border-x-2 ">
      <StartPlace />
      <div className="flex items-center">
        <div className="flex flex-col gap-[2px] items-center w-[26.5px]">
          <div className="h-3 bg-black w-0.5" />
          <div className="h-3 bg-black w-0.5" />
          <div className="h-3 bg-black w-0.5" />
        </div>
        <div className="flex-1 pl-2 flex items-center gap-1">
          <Clock />
          <div>
            {data.time ?? 0}분 {" / "}
            {data.distance ?? 0}km
          </div>
        </div>
      </div>
      <FinishPlace />
    </div>
  );
}
