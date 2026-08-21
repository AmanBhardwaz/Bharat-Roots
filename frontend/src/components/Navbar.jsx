import { Link } from "react-router-dom";
import { Home, Map, Camera, Bot, BookOpen, Award } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-xl">
            🇮🇳
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Bharat Roots
            </h1>

            <p className="text-xs text-slate-500">
              Discover India's Heritage
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-orange-600"
          >
            <Home size={17} />
            Home
          </Link>

          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-orange-600"
          >
            <Map size={17} />
            Explore
          </Link>

          <Link
            to="/quiz"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-orange-600"
          >
            <Award size={17} />
            Quiz
          </Link>

          <Link
            to="/snap"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-orange-600"
          >
            <Camera size={17} />
            Snap & Identify
          </Link>

          <Link
            to="/passport"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-orange-600"
          >
            <BookOpen size={17} />
            Passport
          </Link>

          <Link
            to="/ai-guide"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-orange-600"
          >
            <Bot size={17} />
            AI Guide
          </Link>
        </div>

      </div>
    </nav>
  );
}