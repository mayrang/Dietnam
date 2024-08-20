import { useEffect, useState } from "react";
import useCurrentPosition from "../hooks/useCurrentPosition";
import { calculateDistance } from "../utils/calc";
import Clock from "./icons/Clock";
import Image from "next/image";

export default function DataCard({ data }) {
  const currentPosition = useCurrentPosition();
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    if (currentPosition) {
      const distance =
        calculateDistance(currentPosition, data.start_position.data) ?? 0;
      setDistance(distance);
    }
  }, [currentPosition]);

  return (
    <div className="flex flex-col w-full gap-1">
      <h4 className="font-bold text-2xl">{data?.route_name}</h4>
      <div className=" flex items-center gap-1">
        <Image src={"/running.png"} width={28} height={28} alt="running icon" />
        <div>{data?.type === "running" ? "Running" : "Walking"}</div>
      </div>
      <div className=" flex items-center gap-1">
        <Clock />
        <div>
          {data?.time ?? 0}분 {" / "}
          {data?.distance?.toFixed(2) ?? 0}km
        </div>
      </div>
      <div>Near by {distance.toFixed(2)}km</div>
    </div>
  );
}
