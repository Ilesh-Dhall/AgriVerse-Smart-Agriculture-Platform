"use client";

import { BookOpen } from "lucide-react";
import { useEffect } from "react";
import { knowledgePageData as data } from "@/data/data";

export default function KnowledgePage() {
  useEffect(() => {
    document.title = "Knowledge Library — AgriVerse";
  }, []);

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <BookOpen size={40} className="text-3xl text-purple-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Weather & Climate</span>
          <p className="text-sm">7 day forecast and crop impact insights.</p>
        </div>
      </div>
      <div className="grid gap-4">
        {data.guides.map((guide, index) => (
          <div
            key={index}
            className={
              "p-4 rounded-xl border-2 transition-colors animate-in slide-in-from-bottom-5 duration-300 fade-in " +
              (guide.color == "blue"
                ? "border-blue-200 dark:border-blue-900/80 hover:bg-blue-50/50 dark:hover:bg-blue-900/30"
                : guide.color == "green"
                ? "border-green-400 dark:border-green-900/80 hover:bg-green-50/50 dark:hover:bg-green-900/30"
                : "border-purple-400 dark:border-purple-900/80 hover:bg-purple-50/50 dark:hover:bg-purple-900/30")
            }
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{guide.icon}</span>
              <div className="flex-1">
                <div className="font-medium mb-1 transition-colors">
                  {guide.title}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {guide.description}
                </div>
                <div className="flex items-center gap-2">
                  {guide.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={
                        "text-xs px-2 py-1 rounded " +
                        (guide.color == "blue"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-50"
                          : guide.color == "green"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-50"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-50")
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-xl border p-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <div className="text-sm font-medium">Personalized for You</div>
          </div>
          <div className="text-xs text-muted-foreground">
            Based on your crops and location, we&apos;ve curated the most
            relevant guides and updates.
          </div>
        </div>
      </div>
    </div>
  );
}
