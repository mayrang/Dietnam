"use client";
import Link from "next/link";
import { useEffect } from "react";
import CarouselPart from "../components/CarouselPart";
import HomeBottom from "../components/HomeBottom";
export default function Home() {
  return (
    <div className="h-[calc(100svh-92px)] w-full flex flex-col">
      <CarouselPart />
      <HomeBottom />
    </div>
  );
}
