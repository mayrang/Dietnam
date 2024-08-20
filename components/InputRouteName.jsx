"use client";

import { useState } from "react";
import Map from "./icons/Map";
import Edit from "./icons/Edit";
import { useMakingStore } from "../store/making";
export default function InputRouteName() {
  const [isInput, setIsInput] = useState(false);
  const {
    route: { routeName },
    setRouteName,
  } = useMakingStore();

  const handleChange = (e) => {
    console.log(e.target.value);
    setRouteName(e.target.value);
  };
  return (
    <div className="flex w-full items-center gap-2">
      <Map />
      {isInput ? (
        <input
          className="w-full py-1.5 px-2 flex-1 border-solid border-2 border-black"
          value={routeName}
          onChange={handleChange}
        />
      ) : (
        <div className="w-full py-2 px-2 flex-1 border-solid border-2 border-black">
          {routeName === "" ? "input route name" : routeName}
        </div>
      )}
      <button onClick={() => setIsInput((prev) => !prev)}>
        <Edit />
      </button>
    </div>
  );
}
