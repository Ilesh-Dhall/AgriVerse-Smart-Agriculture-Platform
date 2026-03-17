import { Brain, Database, Globe, Code, Zap, Server, Bot } from "lucide-react";

const technologies = [
  {
    name: "React",
    category: "Frontend",
    description: "Modern UI framework",
    icon: <Code className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "TypeScript",
    category: "Language",
    description: "Type-safe development",
    icon: <Code className="w-5 h-5" />,
    color: "from-blue-600 to-indigo-600",
  },
  {
    name: "ChromaDB",
    category: "Database",
    description: "Vector database",
    icon: <Database className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "LLM/RAG",
    category: "AI",
    description: "Advanced reasoning",
    icon: <Brain className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Vector Search",
    category: "Search",
    description: "Semantic similarity",
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "N8N",
    category: "Automation",
    description: "Workflow automation",
    icon: <Server className="w-5 h-5" />,
    color: "from-red-500 to-pink-500",
  },
  {
    name: "Next.js",
    category: "Framework",
    description: "Full-stack React",
    icon: <Globe className="w-5 h-5" />,
    color: "from-gray-700 to-gray-900",
  },
  {
    name: "Ollama",
    category: "AI Runtime",
    description: "Local AI models",
    icon: <Bot className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-500",
  },
];

const TechStack = () => {
  return (
    <section
      id="tech"
      className="container mx-auto py-16 md:py-24 relative px-4 sm:px-6"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_2px_2px,#6366f1_1px,transparent_0)] bg-[size:30px_30px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16 relative">
        <h2 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-800 to-purple-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent mb-6">
          Built on Cutting-Edge AI
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Retrieval + reasoning, modern web stack, and scalable infrastructure.
          Powered by the latest advancements in AI and web technologies.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {technologies.map((tech, index) => (
          <div
            key={tech.name}
            className="rounded-2xl border bg-white/80 dark:bg-gray-900/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group backdrop-blur-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${tech.color} text-white group-hover:scale-110 transition-transform`}
              >
                {tech.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  {tech.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {tech.category}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {tech.description}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              AI-First Architecture
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Built from the ground up with AI and machine learning at the core.
            Advanced RAG (Retrieval-Augmented Generation) ensures accurate,
            contextual responses.
          </p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              Lightning Fast
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Optimized for speed with intelligent caching, edge computing, and
            efficient vector search algorithms. Sub-second response times even
            with complex queries.
          </p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              Scalable Infrastructure
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Cloud-native architecture designed to scale from hundreds to
            millions of users. Automated workflows and robust data pipelines
            ensure reliability.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
