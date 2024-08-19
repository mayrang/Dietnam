import Marker from "./icons/Marker";

export default function FinishPlace() {
  return (
    <div className="flex w-full items-center gap-2">
      <Marker color="red" />
      <div className="w-full py-2 px-2 flex-1 border-solid border-2 border-black">
        Finish Place
      </div>
    </div>
  );
}
