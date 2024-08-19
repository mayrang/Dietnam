import Marker from "./icons/Marker";

export default function StartPlace() {
  return (
    <div className="flex w-full items-center gap-2">
      <Marker color="green" />
      <div className="w-full py-2 px-2 flex-1 border-solid border-2 border-black">
        Start Place
      </div>
    </div>
  );
}