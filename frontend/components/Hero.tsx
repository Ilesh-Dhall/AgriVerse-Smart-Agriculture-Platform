import { Button } from "@/components/ui/button";
import { ArrowUpRight, Leaf, Sparkles, Zap, Droplets } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import HeroText from "./ui/HeroText";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <header className="relative overflow-hidden min-h-screen px-4 sm:px-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Animation Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-green-500/30 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-teal-400/25 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-lime-400/20 rounded-full blur-md animate-bounce"
          style={{ animationDelay: "3s" }}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Floating Icons */}
        <div
          className="absolute top-1/4 left-20 text-green-500/30 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          <Sparkles size={20} />
        </div>
        <div
          className="absolute top-3/4 right-32 text-emerald-500/30 animate-pulse"
          style={{ animationDelay: "4s" }}
        >
          <Zap size={16} />
        </div>
        <div
          className="absolute top-1/3 right-10 text-teal-500/30 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <Droplets size={18} />
        </div>
      </div>

      <div
        ref={ref}
        className="relative isolate min-h-screen"
        style={{
          backgroundImage: `url(/aog-agri.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Enhanced Interactive Gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background:
              "radial-gradient(600px 400px at var(--mx,50%) var(--my,20%), hsl(142 100% 70% / 0.15), hsl(168 100% 50% / 0.1) 30%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Enhanced Background Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/90 via-emerald-50/85 to-green-100/90 dark:from-gray-900/90 dark:via-emerald-950/85 dark:to-green-900/90"
          aria-hidden="true"
        />

        <nav className="relative z-10 container mx-auto flex items-center justify-between py-6">
          <Link href={"/"} className="group">
            <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                <Leaf size={20} />
              </div>
              <span className="text-xl font-semibold font-logo bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AgriVerse
              </span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <Link
              className="story-link hover:text-green-700 transition-colors font-medium"
              href="#solution"
            >
              Solution
            </Link>
            <Link
              className="story-link hover:text-green-700 transition-colors font-medium"
              href="#trust"
            >
              Trust
            </Link>
            <Link
              className="story-link hover:text-green-700 transition-colors font-medium"
              href="#access"
            >
              Accessibility
            </Link>
            <Link
              className="story-link hover:text-green-700 transition-colors font-medium"
              href="#tech"
            >
              Tech
            </Link>
          </div>
          <Button
            variant="default"
            className="sm:inline-flex bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Link href="/dashboard" aria-label="Open AgriVerse Dashboard">
              Get Started
            </Link>
          </Button>
        </nav>

        <main className="relative z-10 container mx-auto grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24 min-h-[calc(100vh-200px)]">
          <div className="space-y-8 animate-in">
            <HeroText />
            <p className="text-lg sm:text-xl max-w-prose text-gray-700 dark:text-gray-300 leading-relaxed">
              Revolutionizing agriculture with AI-powered insights and smart
              farming solutions that help farmers make informed decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Link
                  href="/dashboard"
                  aria-label="Open AgriVerse Dashboard"
                  className="flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Ask AgriVerse
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200 hover:scale-105"
              >
                Learn more
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm pt-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Powered by
              </span>
              <Separator className="w-1 h-4 bg-green-400" />
              <div className="flex flex-wrap gap-2">
                <Link href={"https://icar.org.in/hi"} target="_blank">
                  <Badge
                    variant="default"
                    className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 hover:border-green-400 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <ArrowUpRight className="size-3 mr-1" strokeWidth={3} />
                    ICAR
                  </Badge>
                </Link>
                <Link href={"https://openweathermap.org/"} target="_blank">
                  <Badge
                    variant="default"
                    className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-300 hover:border-blue-400 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <ArrowUpRight className="size-3 mr-1" strokeWidth={3} />
                    Weather API
                  </Badge>
                </Link>
                <Link href={"https://data.gov.in/"} target="_blank">
                  <Badge
                    variant="default"
                    className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-300 hover:border-purple-400 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <ArrowUpRight className="size-3 mr-1" strokeWidth={3} />
                    Gov Data
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Enhanced Demo Card */}
            <div className="rounded-xl border bg-white/80 dark:bg-gray-900/80 p-6 shadow-2xl backdrop-blur-sm animate-scale-in hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Live AI Demo
              </div>
              <div className="rounded-lg border p-4 space-y-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-inner">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-400">
                  💬 &ldquo;When should I irrigate my wheat next week in
                  Nashik?&rdquo;
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  AI is analyzing data…
                </div>
                <div className="rounded-lg border p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 shadow-sm">
                  <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    🌾 Based on IMD forecast (temp 29-33°C, low rainfall) and
                    soil moisture trends,{" "}
                    <strong>irrigate on Wednesday morning</strong> for 3-4
                    hours. Avoid late afternoon to reduce evaporation.
                  </p>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Source: IMD, ICAR irrigation guidelines
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      Confidence: High (94%)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-sm opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-sm opacity-60 animate-bounce"></div>
          </div>
        </main>
      </div>
    </header>
  );
};

export default Hero;
