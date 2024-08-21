import Link from "next/link";
import Chart from "./icons/Chart";
import Home from "./icons/Home";
import Plus from "./icons/Plus";
export default function HomeBottom() {
  return (
    <div className="w-full  flex items-center justify-between pb-3  px-8">
      <Link href={"/stat"}>
        <Chart />
      </Link>
      <Link className=" " href={"/"}>
        <Home />
      </Link>
      <a className="" href={"/making"}>
        <Plus />
      </a>
    </div>
  );
}
