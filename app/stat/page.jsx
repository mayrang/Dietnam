"use client";

const data01 = [
  { name: "step", value: 65, fill: "#00FF00" },
  { name: "void", value: 35, fill: "#BDFFB6" },
];

const data02 = [
  { name: "km", value: 40, fill: "#239CFF" },
  { name: "void", value: 60, fill: "#C8F5FF" },
];

const data03 = [
  { name: "tune", value: 52, fill: "#FF21B3" },
  { name: "void", value: 48, fill: "#FAD4EB" },
];

const lineData = [
  {
    name: "1",
    steps: 500,
    km: 0,
  },
  {
    name: "2",
    steps: 100,
    km: 0,
  },
  {
    name: "3",
    steps: 70,
    km: 0,
  },
  {
    name: "4",
    steps: 0,
    km: 0,
  },
  {
    name: "5",
    steps: 0,
    km: 0,
  },
  {
    name: "6",
    steps: 0,
    km: 0,
  },
  {
    name: "7",
    steps: 100,
    km: 500,
  },
  {
    name: "8",
    steps: 80,
    km: 505,
  },
  {
    name: "9",
    steps: 1000,
    km: 510,
  },
  {
    name: "10",
    steps: 800,
    km: 515,
  },
  {
    name: "11",
    steps: 700,
    km: 1000,
  },
  {
    name: "12",
    steps: 550,
    km: 1400,
  },
  {
    name: "13",
    steps: 750,
    km: 1400,
  },
  {
    name: "14",
    steps: 900,
    km: 1400,
  },
  {
    name: "15",
    steps: 1500,
    km: 1400,
  },
  {
    name: "16",
    steps: 2600,
    km: 1500,
  },
  {
    name: "17",
    steps: 2000,
    km: 1600,
  },
  {
    name: "18",
    steps: 1200,
    km: 1700,
  },
  {
    name: "19",
    steps: 1000,
    km: 1900,
  },
  {
    name: "20",
    steps: 850,
    km: 2100,
  },
  {
    name: "21",
    steps: 1700,
    km: 2200,
  },
  {
    name: "22",
    steps: 1900,
    km: 2300,
  },
  {
    name: "23",
    steps: 2500,
    km: 2310,
  },
  {
    name: "24  -.",
    steps: 3000,
    km: 2320,
  },
];

const barData = [
  { name: "1", value: 2000 },
  { name: "2", value: 5300 },
  { name: "3", value: 3100 },
  { name: "4", value: 1300 },
  { name: "5", value: 1000 },
  { name: "6", value: 800 },
  { name: "7", value: 1900 },
  { name: "8", value: 3700 },
  { name: "9", value: 3600 },
  { name: "10", value: 1900 },
  { name: "11", value: 2900 },
  { name: "12", value: 5000 },
  { name: "13", value: 6000 },
  { name: "14", value: 4000 },
  { name: "15", value: 5100 },
  { name: "16", value: 3900 },
  { name: "17", value: 1900 },
  { name: "18", value: 1050 },
  { name: "19", value: 1850 },
  { name: "20", value: 1750 },
  { name: "21", value: 1950 },
  { name: "22", value: 1250 },
  { name: "23", value: 950 },
  { name: "24", value: 2850 },
  { name: "25", value: 1200 },
  { name: "26", value: 3100 },
  { name: "27", value: 1100 },
  { name: "28", value: 1800 },
  { name: "29", value: 4150 },
  { name: "30", value: 2400 },
];

import Piechart from "../../components/Piechart";
import Linechart from "../../components/Linechart";
import Barchart from "../../components/Barchart";
import Image from "next/image";

export default function StatPage() {
  return (
    <div className="h-full min-h-[calc(100svh-52px)] overflow-auto gap-2 p-4">
      <h2 className=" font-bold text-2xl ml-4">{"Daily"}</h2>
      <div className="flex items-center w-full h-28 justify-between mt-2">
        <Piechart data={data01} type="Step" number="1638" />

        <Piechart data={data02} type="Km" number="1.8km" />
        <Piechart data={data03} type="Time" number="1.0h" />
      </div>
      <div className="w-full h-40 mt-6">
        <Linechart data={lineData} />
      </div>
      <h2 className="mt-6 font-bold text-2xl ml-4">{"Monthly"}</h2>
      <div className="w-full h-40 mt-6">
        <Barchart data={barData} />
      </div> 
      <div className="relative h-[250px] ">
      <Image
            src={"/no-bg-logo.png"}
            alt="dietnam logo"
            width={250}
            height={250}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
          />
          <div className="absolute top-1/2 left-1/2 z-5  size-[250px]  bg-white opacity-70 -translate-x-1/2 -translate-y-1/2" />
          <Image
            src={"/dietnam-font.png"}
            alt="dietnam logo"
            width={300}
            height={300}
            className="absolute top-1/2 z-10 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
      </div>
    </div>
  );
}
