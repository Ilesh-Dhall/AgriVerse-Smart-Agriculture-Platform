import {
  Clock,
  Database,
  Globe,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";

const Trust = () => {
  return (
    <section
      id="trust"
      className="container mx-auto py-16 md:py-24 relative px-4 sm:px-6"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_2px_2px,#3b82f6_1px,transparent_0)] bg-[size:25px_25px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center mb-16 relative">
        <h2 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-6">
          Trusted by Farmers, Verified by Experts
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Our AI-powered platform delivers reliable, accurate agricultural
          insights backed by authoritative data sources and rigorous validation.
        </p>
      </div>

      <div className="rounded-3xl border bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-gray-900/90 dark:to-blue-950/30 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-lg"></div>

        <div className="grid md:grid-cols-3 gap-8 items-center text-center mb-10 relative">
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              3s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Median response time
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Lightning-fast insights
            </div>
          </div>
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Expert research pages
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Comprehensive knowledge base
            </div>
          </div>
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              10+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Languages supported
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Truly multilingual platform
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Trusted Data Sources
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="px-4 py-2 rounded-full border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800 text-green-800 dark:text-green-200 font-medium hover:scale-105 transition-transform shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                ICAR
              </div>
            </div>
            <div className="px-4 py-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 dark:border-blue-800 text-blue-800 dark:text-blue-200 font-medium hover:scale-105 transition-transform shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                OpenWeatherMap
              </div>
            </div>
            <div className="px-4 py-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 dark:border-purple-800 text-purple-800 dark:text-purple-200 font-medium hover:scale-105 transition-transform shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Data.gov.in
              </div>
            </div>
            <div className="px-4 py-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 dark:border-orange-800 text-orange-800 dark:text-orange-200 font-medium hover:scale-105 transition-transform shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                FAO
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">4.9/5</span> average rating from
            agricultural experts and researchers
          </p>
        </div>
      </div>
    </section>
  );
};

export default Trust;
