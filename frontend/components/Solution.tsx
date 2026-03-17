import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, CloudRain, Sprout, Database, Languages } from "lucide-react";

const samples = [
  "How do I control brown planthopper in paddy?",
  "Should I sow chickpea this week in Indore?",
  "Will cold wave affect my tomato crop in Nashik?",
];

const QueryDemo = () => {
  const [query, setQuery] = useState(samples[0]);
  const [answer, setAnswer] = useState("");
  const i = useRef(0);

  const generate = () => {
    const text =
      "Based on current weather, soil, and pest advisories: use yellow sticky traps, avoid broad-spectrum sprays, and apply recommended bio-control. Source: ICAR & IMD.";
    setAnswer("");
    i.current = 0;
    const interval = setInterval(() => {
      setAnswer((a) => a + text[i.current]);
      i.current++;
      if (i.current >= text.length) clearInterval(interval);
    }, 12);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="rounded-lg border bg-card p-5 shadow-[var(--shadow-elegant)]">
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {samples.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              setTimeout(generate, 50);
            }}
            className="px-3 py-1 rounded border text-sm hover-scale"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask naturally in your language…"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          variant="outline"
          onClick={generate}
          className="w-full sm:w-auto"
        >
          Ask AgriVerse
        </Button>
        <div className="rounded-md border bg-background p-3 text-sm min-h-24 animate-fade-in">
          {answer}
        </div>
      </div>
    </div>
  );
};

const Solution = () => {
  return (
    <section
      id="solution"
      className="container mx-auto py-16 md:py-24 relative px-4 sm:px-6"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_2px_2px,#059669_1px,transparent_0)] bg-[size:30px_30px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16 relative">
        <h2 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent mb-6">
          From Question to Actionable Advice
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Ask naturally. Our multilingual AI processes weather, crop science,
          soil, and finance data to give you clear, trusted recommendations
          powered by cutting-edge technology.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-4">
          <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover:scale-110 transition-transform">
                <Languages
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Ask Naturally
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Chat in Hindi, English or your regional language. Voice support
              with advanced speech recognition available.
            </p>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 group-hover:scale-110 transition-transform">
                <Brain
                  className="text-purple-600 dark:text-purple-400"
                  size={20}
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                AI Reasoning
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Advanced retrieval and reasoning across weather, crop cycles, pest
              science, and agricultural policies using state-of-the-art models.
            </p>
          </div>
        </div>

        <div className="relative">
          <QueryDemo />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 group-hover:scale-110 transition-transform">
                <Database
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Grounded in Facts
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Cites sources from ICAR, IMD, and verified public datasets to
              reduce hallucinations and ensure accuracy.
            </p>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 group-hover:scale-110 transition-transform">
                <CloudRain
                  className="text-cyan-600 dark:text-cyan-400"
                  size={20}
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Actionable Outputs
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Clear steps, precise timing, exact quantities—no jargon.
              Confidence scores and reliability metrics included.
            </p>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 group-hover:scale-110 transition-transform">
                <Sprout
                  className="text-orange-600 dark:text-orange-400"
                  size={20}
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Designed for Trust
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Explainable, reliable, and rigorously tested for real-world
              agricultural scenarios and edge cases.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
