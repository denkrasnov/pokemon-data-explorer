"use client";
import { useRouter } from "next/navigation";

export const GeneralError = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center">
      <h2>Something went wrong!!!</h2>
      <button
        className="border border-(--border-color) rounded-md text-white font-bold py-1 px-2 mt-4 cursor-pointer bg-(--button-primary-color) hover:bg-(--button-hover-color)"
        type="button"
        onClick={() => router.refresh()}
      >
        Try again
      </button>
    </div>
  );
};
