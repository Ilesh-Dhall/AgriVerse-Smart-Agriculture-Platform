"use client";

import { CloudSun } from "lucide-react";
import { useEffect } from "react";
import { weatherPageData as data } from "@/data/data";

export default function WeatherPage() {
  useEffect(() => {
    document.title = "Weather & Climate — AgriVerse";
  }, []);

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <CloudSun size={40} className="text-3xl text-blue-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Weather & Climate</span>
          <p className="text-sm">7 day forecast and crop impact insights.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        {data.forecast.map((f, index) => (
          <div
            key={f.day}
            className={`rounded-xl p-4 hover-lift border-2 group transition-all duration-300 ${
              f.weather === "rainy"
                ? "bg-bluish-bg border-bluish-border"
                : f.weather === "sunny"
                ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200/50"
                : "bg-gray-50 dark:bg-gray-900/30 border-gray-200/50"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {f.day}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{f.icon}</span>
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform">
                {f.temp}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              💧 Rain: {f.rain}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-6 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-base font-semibold">Crop Impact Forecast</div>
          <div className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-xs font-medium text-blue-700 dark:text-white">
            AI Insights
          </div>
        </div>
        <div className="grid gap-3 ">
          {data.cropImpact.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-background border"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="text-sm">
                <span className="font-medium">{item.crop}:</span> {item.advice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
