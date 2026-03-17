import {
  Leaf,
  Mail,
  MapPin,
  Phone,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950/30 px-4 sm:px-6">
      <div className="container mx-auto py-16 px-0">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <Leaf size={24} />
              </div>
              <span className="text-2xl font-bold font-logo bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AgriVerse
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-md">
              Revolutionizing agriculture with AI-powered insights and smart
              farming solutions. Empowering farmers with intelligent
              decision-making tools for sustainable growth.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Ilesh-Dhall/AgriVerse-Capital-One-Launchpad-2025-Hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Quick Links
            </h3>
            <div className="space-y-3">
              <a
                href="#problem"
                className="block text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Problem
              </a>
              <a
                href="#solution"
                className="block text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Solution
              </a>
              <a
                href="#trust"
                className="block text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Trust
              </a>
              <a
                href="#access"
                className="block text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Accessibility
              </a>
              <a
                href="#tech"
                className="block text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Technology
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={16} />
                <span className="text-sm">contact@agriverse.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone size={16} />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MapPin size={16} />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} AgriVerse. All rights reserved. Built
              for Capital One Launchpad 2025 Hackathon.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Terms of Service
              </a>
              <Link
                href="/dashboard"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
