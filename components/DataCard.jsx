import { useEffect, useState } from "react";
import useCurrentPosition from "../hooks/useCurrentPosition";
import { calculateDistance } from "../utils/calc";
import Clock from "./icons/Clock";

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
