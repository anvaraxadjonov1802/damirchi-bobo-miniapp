import React, { useEffect, useState } from "react";
import { Utensils } from "lucide-react";

function MenuSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[#F7F3EB] text-[#241812]">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="flex h-[64px] items-center justify-between border-b border-[#ECE5DC] bg-white px-4">
          <div className="h-8 w-28 animate-pulse rounded-xl bg-[#EEE7DE]" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-[#EEE7DE]" />
        </div>

        <div className="px-4 pt-3">
          <div className="grid grid-cols-2 gap-2 rounded-[20px] border border-[#E9E3DA] bg-white p-2">
            <div className="h-12 animate-pulse rounded-[16px] bg-[#E8D5B2]" />
            <div className="h-12 animate-pulse rounded-[16px] bg-[#F0EBE4]" />
          </div>

          <div className="mt-4 h-[138px] animate-pulse rounded-[22px] bg-[#E8DED1]" />
          <div className="mt-4 h-11 animate-pulse rounded-[16px] bg-white" />

          <div className="mt-3 flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-white"
              />
            ))}
          </div>

          <div className="mt-5 h-6 w-36 animate-pulse rounded-lg bg-[#E3DAD0]" />

          <div className="mt-3 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[20px] border border-[#E9E3DA] bg-white"
              >
                <div className="h-[145px] animate-pulse bg-[#E8E1D8]" />
                <div className="space-y-2 p-3">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-[#E8E1D8]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#F0EBE4]" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-[#F0EBE4]" />
                  <div className="mt-3 h-4 w-20 animate-pulse rounded bg-[#E8D5B2]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingScreen() {
  const [showBrandSplash, setShowBrandSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBrandSplash(false), 320);
    return () => window.clearTimeout(timer);
  }, []);

  if (!showBrandSplash) {
    return <MenuSkeleton />;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#FFFAF2] p-6 text-[#2C211A]">
      <div className="relative flex max-w-xs flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="h-20 w-20 animate-spin rounded-full border-2 border-[#E9DCC7] border-t-[#C89438]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-13 w-13 items-center justify-center rounded-full border border-[#E9DCC7] bg-white shadow-md">
              <Utensils className="h-6 w-6 text-[#A97824]" />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-black leading-none text-[#2C211A]">
          Damirchi
        </h1>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#A97824]">
          Online menu
        </p>
      </div>
    </div>
  );
}
