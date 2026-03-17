"use client";

import { LineChart as LineChartIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { marketPageData as data } from "@/data/data";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
} from "recharts";

export default function MarketPage() {
  const [selectedCrop, setSelectedCrop] = useState(data[0]);
  const dark = useTheme().theme === "dark";
  useEffect(() => {
    document.title = "Market Intelligence — AgriVerse";
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
          <LineChartIcon size={40} className="text-3xl text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Market Intelligence</span>
          <p className="text-sm">Current prices and short-term trends.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        {data.map((crop) => (
          <div
            onClick={() => setSelectedCrop(crop)}
            key={crop.name}
            className={`rounded-xl border-2 hover:bg-green-50 hover:dark:bg-green-900/30 p-4 hover:border-green-500 transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{crop.icon}</span>
              <div className="text-sm font-medium text-muted-foreground">
                {crop.name} — {crop.location}
              </div>
            </div>
            <div
              className={`text-3xl font-bold group-hover:scale-105 transition-transform`}
            >
              ₹ {crop.price.toLocaleString()}
              <span className="text-sm font-normal">/q</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-white">
                {crop.change}
              </span>
              <span className="text-xs text-muted-foreground">
                vs last week
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-6 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-semibold">Price Trend (7 days)</div>
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-white">
            {selectedCrop.name}
          </div>
        </div>
        <div className="h-48 rounded-lg p-4 border">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedCrop.priceData}>
              <XAxis
                domain={["dataMin", "dataMax"]}
                dataKey="day"
                tick={{
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={["dataMin", "dataMax"]}
                tick={{
                  fontSize: 12,
                }}
              />
              <RechartTooltip
                contentStyle={{
                  borderRadius: "8px",
                  color: dark ? "#fff" : "#000",
                  backgroundColor: dark ? "#333" : "#fff",
                }}
              />
              <Line
                animationDuration={200}
                type="bump"
                dataKey="price"
                stroke="hsl(160 60% 45%)"
                strokeWidth={3}
                dot={{
                  fill: "hsl(160 60% 45%)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(160 60% 45%)",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
