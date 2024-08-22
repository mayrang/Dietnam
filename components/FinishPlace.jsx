import Marker from "./icons/Marker";

export default function FinishPlace() {
  return (
    <div className="flex w-full items-center gap-2">
      <Marker color="blue" />
      <div className="w-full py-2 px-2 flex-1 text-2xl font-extrabold text-gray-500">
        Finish Place
      </div>
    </div>
  );
}
