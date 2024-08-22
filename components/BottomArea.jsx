"use client";
import StartPhoto from "./StartPhoto";
import CheckStartPhoto from "./CheckStartPhoto";
import { useStepStore } from "../store/making";
import Recording from "./Recording";
import FinishPhoto from "./FinishPhoto";
import CheckFinishPhoto from "./CheckFinishPhoto";

export default function BottomArea() {
  const { step } = useStepStore();
  return (
    <div className="absolute p-6 bottom-0 w-5/6 mx-auto left-0 bg-white z-20 right-0 rounded-t-3xl shadow-2xl">
      {step === "startPhoto" && <StartPhoto />}
      {step === "checkStartPhoto" && <CheckStartPhoto />}
      {step === "recording" && <Recording />}
      {step === "finishPhoto" && <FinishPhoto />}
      {step === "checkFinishPhoto" && <CheckFinishPhoto />}
    </div>
  );
}
