"use client";
import Image from "next/image";
import FinishPlace from "./FinishPlace";
import { useMakingStore, useStepStore, useTimeStore } from "../store/making";
import { useEffect } from "react";
import InputRouteName from "./InputRouteName";
import { supabase } from "../supabase/supabase";
import { useRouter } from "next/navigation";
import { calculateTotalDistance } from "../utils/calc";
export default function CheckFinishPhoto() {
  const {
    route: { finishImage, routeName },
    route,
  } = useMakingStore();
  const { setStep } = useStepStore();
  const router = useRouter();
  const { startTime, finishTime } = useTimeStore();
  useEffect(() => {
    if (!finishImage) {
      setStep("finishPhoto");
    }
  }, [finishImage]);

  const handleSave = async () => {
    if (routeName === "") {
      alert("Please input route name");
      return
    }
    let time = Math.round((finishTime - startTime) / 60000);
    const coords = route.json.data.features[0].geometry.coordinates;
    if (!coords) {
      alert("데이터가 없습니다.");
      setStep("startPhoto");
      return
    }
    const distance = calculateTotalDistance(coords);
    console.log("time", time, distance);
    const { data } = await supabase
      .from("route")
      .insert([
        {
          route: route.json,

          start_image: route.startImage,
          finish_image: route.finishImage,
          route_name: route.routeName,
          start_position: {
            data: route.startPosition,
          },
          finish_position: {
            data: route.finishPosition,
          },
          type: route.type,
          time: time,
          distance: distance.toFixed(2),
        },
      ])
      .select();
    if (typeof window !== "undefined") {
      window.location.href = `/detail/${data[0]?.id}`;
    }
    console.log(route);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <InputRouteName />
      <FinishPlace />
      <div className="flex w-full  items-center gap-2">
        <div className="cursor-pointer w-full h-[250px] rounded-3xl shadow flex justify-center items-center overflow-hidden">
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
        className="px-7 rounded-md font-bold cursor-pointer py-2 border-2 border-solid border-gray-300 "
      >
        Save
      </button>
    </div>
  );
}
