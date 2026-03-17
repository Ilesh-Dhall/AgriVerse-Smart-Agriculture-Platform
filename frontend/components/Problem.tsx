import { AlertTriangle, Cloud, Coins, HelpCircle, Sprout } from "lucide-react";

const questions = [
  {
    text: "When should I irrigate?",
    icon: <Sprout className="w-5 h-5 text-green-600" />,
    color:
      "from-green-100 to-emerald-100 border-green-200 dark:from-green-900 dark:to-emerald-900 dark:border-green-900",
  },
  {
    text: "What seed variety suits this unpredictable weather?",
    icon: <Cloud className="w-5 h-5 text-blue-600" />,
    color:
      "from-blue-100 to-sky-100 border-blue-200 dark:from-blue-900 dark:to-sky-900 dark:border-blue-800",
  },
  {
    text: "Will next week's temperature drop kill my yield?",
    icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
    color:
      "from-orange-100 to-yellow-100 border-orange-200 dark:from-orange-900 dark:to-yellow-900 dark:border-orange-800",
  },
  {
    text: "Can I afford to wait for the market to improve?",
    icon: <Coins className="w-5 h-5 text-purple-600" />,
    color:
      "from-purple-100 to-violet-100 border-purple-200 dark:from-purple-900 dark:to-violet-900 dark:border-purple-800",
  },
  {
    text: "Where can I get affordable credit, and will any policy help me?",
    icon: <HelpCircle className="w-5 h-5 text-teal-600" />,
    color:
      "from-teal-100 to-cyan-100 border-teal-200 dark:from-teal-900 dark:to-cyan-900 dark:border-teal-800",
  },
];

const Problem = () => {
  return (
    <section
      id="problem"
      className="container mx-auto py-16 md:py-24 relative px-4 sm:px-6"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#0f172a_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-12 relative">
        <h2 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
          Every Question Matters, Every Decision Counts
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          When crops fail, livelihoods are at risk. Farmers need clear, trusted
          answers—fast. AgriVerse provides intelligent solutions for
          agriculture&apos;s biggest challenges.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {questions.map((q, index) => (
          <div
            key={q.text}
            className={`rounded-xl border bg-gradient-to-br ${q.color} p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in group`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/80 shadow-sm group-hover:scale-110 transition-transform duration-200">
                {q.icon}
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-white leading-relaxed flex-1">
                {q.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Problem;
