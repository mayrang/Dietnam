"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const handleBackButton = () => {
    router.back();
  };
  return (
    <button
      className="font-bold block pt-1 top-3 text-3xl"
      onClick={handleBackButton}
    >
      {"<"}
    </button>
  );
}
