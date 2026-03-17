"use client";

import { PiggyBank, Wallet } from "lucide-react";
import { useEffect } from "react";
import { financePageData as data } from "@/data/data";

export default function FinancePage() {
  useEffect(() => {
    document.title = "Financial Planning — AgriVerse";
  }, []);

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="p-2 rounded-lg bg-yellow-500/10">
          <Wallet size={40} className="text-3xl text-yellow-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Financial Planning</span>
          <p className="text-sm">Track costs vs returns and explore schemes.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="rounded-xl border p-4 bg-red-50/50 dark:bg-red-900/30">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank />
            <div className="text-sm font-medium">Budget Used</div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-white">
            ₹ {data.budgetUsed.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex-1 bg-red-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-500 h-2 rounded-full loadin"
                style={{
                  width: `${(data.budgetUsed / data.totalBudget) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {((data.budgetUsed / data.totalBudget) * 100).toFixed(1) + "%"}
            </span>
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-green-50/50 dark:bg-green-900/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <div className="text-sm font-medium">Expected Returns</div>
          </div>
          <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">
            ₹ {data.expectedReturns.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100">
              {data.roi}% ROI
            </span>
            <span className="text-xs text-muted-foreground">projected</span>
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-blue-50/50 dark:bg-blue-900/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏛️</span>
            <div className="text-sm font-medium">Govt Schemes</div>
          </div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            3 <span className="text-lg font-normal">available</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
              ⚡ 2 expiring soon
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border p-6 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-base font-semibold">Available Schemes</div>
          <div className="px-2 py-1 rounded-full text-xs font-medium ">
            Updated Today
          </div>
        </div>
        <div className="grid gap-3">
          {data.availableSchemes.map((scheme, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-background border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{scheme.icon}</span>
                <div>
                  <div className="font-medium text-sm">{scheme.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {scheme.description}
                  </div>
                </div>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded ${
                  scheme.status === "Eligible"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : scheme.status === "5 days left"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100"
                    : scheme.status === "Apply Now"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100"
                }`}
              >
                {scheme.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
