import Link from "next/link";
import Chart from "./icons/Chart";
import Home from "./icons/Home";
import Plus from "./icons/Plus";
export default function HomeBottom() {
  return (
    <div className="w-full  flex items-center justify-between pb-5 px-8">
      <Link href={"/stat"}>
        <Chart />
      </Link>
      <Link className="w-[48px]" href={"/"}>
        <Home />
      </Link>
      <a className="w-[48px]" href={"/making"}>
        <Plus />
      </a>
    </div>
  );
}
