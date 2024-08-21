import Link from "next/link";
import Chart from "./icons/Chart";
import Home from "./icons/Home";
import Plus from "./icons/Plus";
export default function HomeBottom() {
  return (
    <div className="w-full  flex items-center justify-between pb-3  px-8">
      <a href={"/stat"}>
        <Chart />
      </a>
      <a className=" " href={"/"}>
        <Home />
      </a>
      <a className="" href={"/making"}>
        <Plus />
      </a>
    </div>
  );
}
