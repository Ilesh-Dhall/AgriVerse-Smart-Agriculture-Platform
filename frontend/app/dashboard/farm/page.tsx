"use client";

import { Sprout } from "lucide-react";
import { useEffect } from "react";
import { farmPageData as data } from "@/data/data";

export default function FarmPage() {
  useEffect(() => {
    document.title = "My Farm — AgriVerse";
  }, []);

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="p-2 rounded-lg bg-green-500/10">
          <Sprout size={40} className="text-3xl text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">My Farm</span>
          <p className="text-sm">Your farm details, crops and seasonal plan.</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
          <div className="rounded-xl border p-4 bg-orange-50/50 dark:bg-orange-900/30">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Farm Size
            </div>
            <div className="text-3xl font-bold text-foreground">
              {data.farmSize}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              📏 Total area
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-green-50/50 dark:bg-green-900/30">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Location
            </div>
            <div className="text-3xl font-bold text-foreground">
              {data.location}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              📍 District, State
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-blue-50/50 dark:bg-blue-900/30">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Current Crops
            </div>
            <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform">
              {data.currentCrops}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              🌾 Active crops
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-6 animate-in slide-in-from-bottom-5 duration-300 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-base font-semibold">Crop Calendar</div>
            <div className="px-2 py-1 rounded-full bg-accent/10 text-xs font-medium text-accent-foreground">
              {new Date().getFullYear()}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 text-xs">
            {data.cropCalendar.map((month, i) => {
              return (
                <div
                  key={i}
                  className={`h-10 rounded-lg flex items-center justify-center font-medium transition-all hover-scale ${
                    month.active
                      ? "bg-greenish-bg border-green-200 dark:border-green-800 border-2"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {" "}
                  {month.month}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            🌱 Green months indicate active growing season
          </div>
        </div>
      </div>
    </div>
  );
}
