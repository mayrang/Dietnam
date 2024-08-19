"use client";
import Image from "next/image";
import FinishPlace from "./FinishPlace";
import { useMakingStore, useStepStore } from "../store/making";
import { useEffect } from "react";
import InputRouteName from "./InputRouteName";
import { supabase } from "../supabase/supabase";
import { useRouter } from "next/navigation";
export default function CheckFinishPhoto() {
  const {
    route: { finishImage, routeName },
    route,
  } = useMakingStore();
  const { setStep } = useStepStore();
  const router = useRouter();

  useEffect(() => {
    if (!finishImage) {
      setStep("finishPhoto");
    }
  }, [finishImage]);

  const handleSave = async () => {
    if (routeName === "") {
      alert("Please input route name");
    }
    const { data } = await supabase
      .from("route")
      .insert([
        {
          route: route.json,

          start_image: route.startImage,
          finish_image: route.finishUrl,
          route_name: route.routeName,
          start_position: {
            data: route.startPosition,
          },
          finish_position: {
            data: route.finishPosition,
          },
          type: route.type,
        },
      ])
      .select();
    router.replace(`/detail/${data[0].id}`);
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
