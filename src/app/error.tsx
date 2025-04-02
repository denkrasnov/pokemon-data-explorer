"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2>Something went wrong!</h2>
      <button
        className="border border-(--border-color) rounded-md text-white font-bold py-1 px-2 mt-4 cursor-pointer bg-(--button-primary-color) hover:bg-(--button-hover-color)"
        type="button"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
