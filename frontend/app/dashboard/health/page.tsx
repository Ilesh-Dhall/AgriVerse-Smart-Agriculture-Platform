"use client";

import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Image as ImageIcon,
  Lightbulb,
  Check,
  Bot,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function UploadPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // TODO: Handle file upload and AI analysis

  return (
    <div className="flex items-center gap-4">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
          aria-label="Upload crop photo"
        />
        <Button
          variant="secondary"
          className="gap-2 h-12 px-6 bg-red-50 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-600/30 text-red-700 dark:text-red-50 hover-lift"
          asChild
        >
          <span className="inline-flex items-center">
            <ImageIcon className="h-5 w-5" />
            Choose Crop Image
          </span>
        </Button>
      </label>
      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt="Uploaded crop leaf preview"
            width={80}
            height={80}
            className="h-20 w-20 rounded-xl border-2 border-red-200 shadow-md"
            loading="lazy"
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}

export default function HealthPage() {
  useEffect(() => {
    document.title = "Crop Health Monitor — AgriVerse";
  }, []);

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="p-2 rounded-lg bg-red-500/10">
          <ShieldAlert size={40} className="text-3xl text-red-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Weather & Climate</span>
          <p className="text-sm">7 day forecast and crop impact insights.</p>
        </div>
      </div>

      <div className="p-6 rounded-xl border-2 border-dashed border-red-200 hover:border-red-400 dark:border-red-800/50 hover:dark:border-red-300/50 transition-colors animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <UploadPreview />
      </div>
      <div className="rounded-xl border p-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb />
          <div className="text-sm font-medium">Photography Tips</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Check color="green" />
            <span>Take photos in daylight</span>
          </div>
          <div className="flex items-center gap-2">
            <Check color="green" />
            <span>Focus on affected leaves</span>
          </div>
          <div className="flex items-center gap-2">
            <Check color="green" />
            <span>Include both sides of leaf</span>
          </div>
          <div className="flex items-center gap-2">
            <Check color="green" />
            <span>Multiple angles preferred</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border p-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Bot />
          <div className="text-sm font-medium">AI Analysis Results</div>
          <div className="px-2 py-1 rounded-full bg-green-100 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-50">
            95% Confidence
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-background border">
            <div className="font-medium text-orange-600 mb-1">
              🍅 Tomato Leaf Curl Disease
            </div>
            <div className="text-muted-foreground text-xs mb-2">
              Detected in uploaded images
            </div>
            <div className="text-xs">
              <span className="font-medium">Treatment:</span> Apply neem oil
              spray, improve drainage, remove affected leaves
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background border">
            <div className="font-medium text-blue-600 mb-1">
              💧 Irrigation Recommendation
            </div>
            <div className="text-xs">
              <span className="font-medium">Timing:</span> Reduce watering
              frequency, water early morning only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
