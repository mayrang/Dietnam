import Link from "next/link";
import BackIcon from "./icons/BackIcon";
export default function BackButton() {
  return (
    <a href={"/"} className="font-bold block pt-1 top-3 text-3xl">
      <BackIcon />
    </a>
  );
}
