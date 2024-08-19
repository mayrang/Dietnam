"use client";
import { useEffect, useState } from "react";
import { useDetailStore } from "../store/detail";
export default function RouteName() {
  const [routeName, setRouteName] = useState("-");
  const { data } = useDetailStore();
  useEffect(() => {
    if (data?.route_name) {
      setRouteName(data.route_name);
    }
  }, [data?.route_name]);
  return <div className="font-bold text-xl">{routeName}</div>;
}
