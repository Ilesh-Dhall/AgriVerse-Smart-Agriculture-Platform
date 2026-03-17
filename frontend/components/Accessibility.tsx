import {
  Languages,
  Mic,
  WifiOff,
  Volume2,
  Smartphone,
  Users,
} from "lucide-react";

const Accessibility = () => {
  return (
    <section
      id="access"
      className="container mx-auto py-16 md:py-24 relative px-4 sm:px-6"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#10b981_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16 relative">
        <h2 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-teal-600 dark:from-green-400 dark:to-teal-300 bg-clip-text text-transparent mb-6">
          Designed for Every Farmer
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Built for usability in low-connectivity, multilingual, real-world
          agricultural settings. Technology that adapts to you, not the other
          way around.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mb-12">
        <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover:scale-110 transition-transform">
              <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
            Voice Input
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Speak naturally and get instant answers. Perfect for hands-free
            operation in the field.
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/50 group-hover:scale-110 transition-transform">
              <Languages className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
            Multiple Languages
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Hindi • English • Tamil • Marathi • Bengali • Gujarati and more
            regional languages.
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/50 group-hover:scale-110 transition-transform">
              <WifiOff className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
            Offline Ready
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Optimized for patchy connectivity with intelligent caching and
            progressive loading.
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Language Example Card */}
        <div className="rounded-2xl border bg-white/80 dark:bg-gray-900/80 p-8 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                One Question, Many Languages
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ask in your preferred language, get answers that make sense
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                🇬🇧 English
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                When should I irrigate my wheat in Nashik next week?
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400">
              <div className="font-medium text-green-800 dark:text-green-200 mb-1">
                🇮🇳 हिंदी
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                अगला हफ्ता नासिक में गेंहू की सिंचाई कब करनी चाहिए?
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-400">
              <div className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                🇮🇳 தமிழ்
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                அடுத்த வாரம் நாசிக்கில் கோதுமைக்கு நீர்ப்பாசனம் எப்போது செய்ய
                வேண்டும்?
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Features Card */}
        <div className="rounded-2xl border bg-white/80 dark:bg-gray-900/80 p-8 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50">
              <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                Inclusive Design
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accessible to farmers with varying technical literacy
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex-shrink-0">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  Mobile-First Design
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized for smartphones with large touch targets and clear
                  typography
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 flex-shrink-0">
                <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  Audio Responses
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Listen to answers while working, perfect for busy farmers
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex-shrink-0">
                <WifiOff className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  Smart Caching
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Key information available even with poor internet connectivity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accessibility;
