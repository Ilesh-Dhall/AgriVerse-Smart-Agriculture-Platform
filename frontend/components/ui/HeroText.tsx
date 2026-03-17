"use client";
import React from "react";
import { motion, MotionProps } from "motion/react";

interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        "relative inline-flex overflow-hidden bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
        <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
      </span>
    </MotionComponent>
  );
}

function HeroText() {
  return (
    <div className="flex">
      <style jsx global>{`
        :root {
          --color-1: 330 100% 40%;
          --color-2: 140 100% 55%;
          --color-3: 210 100% 30%;
          --color-4: 60 100% 70%;
          --color-5: 295 100% 45%;
        }

        .dark {
          --color-1: 330 100% 40%;
          --color-2: 140 100% 55%;
          --color-3: 210 100% 30%;
          --color-4: 60 100% 70%;
          --color-5: 295 100% 45%;
        }

        @keyframes gradient-border {
          0%,
          100% {
            border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
          }
          25% {
            border-radius: 47% 29% 39% 49% / 61% 19% 66% 26%;
          }
          50% {
            border-radius: 57% 23% 47% 72% / 63% 17% 66% 33%;
          }
          75% {
            border-radius: 28% 49% 29% 100% / 93% 20% 64% 25%;
          }
        }

        @keyframes gradient-1 {
          0%,
          100% {
            top: 0;
            right: 0;
          }
          50% {
            top: 50%;
            right: 25%;
          }
          75% {
            top: 25%;
            right: 50%;
          }
        }

        @keyframes gradient-2 {
          0%,
          100% {
            top: 0;
            left: 0;
          }
          60% {
            top: 75%;
            left: 25%;
          }
          85% {
            top: 50%;
            left: 50%;
          }
        }

        @keyframes gradient-3 {
          0%,
          100% {
            bottom: 0;
            left: 0;
          }
          40% {
            bottom: 50%;
            left: 25%;
          }
          65% {
            bottom: 25%;
            left: 50%;
          }
        }

        @keyframes gradient-4 {
          0%,
          100% {
            bottom: 0;
            right: 0;
          }
          50% {
            bottom: 25%;
            right: 40%;
          }
          90% {
            bottom: 50%;
            right: 25%;
          }
        }
      `}</style>
      <h1 className=" text-4xl font-bold tracking-tighter text-foreground md:text-5xl lg:text-7xl">
        Your <GradientText>Intelligent</GradientText> Farming Companion
      </h1>
    </div>
  );
}

export default HeroText;
