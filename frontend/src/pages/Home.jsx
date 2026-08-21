import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import {
  Map,
  Camera,
  Bot,
  ArrowRight,
  ShieldCheck,
  Languages,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      {/* ================= HERO ================= */}

      <section className="overflow-hidden bg-linear-to-br from-orange-50 via-white to-emerald-50 pt-28">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">

              <Sparkles size={16} />

              AI-Powered Cultural Heritage

            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">

              Discover the

              <span className="text-orange-600">
                {" "}Stories{" "}
              </span>

              Behind India.

            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">

              Explore India's monuments, traditions, crafts and stories
              through an interactive AI-powered heritage experience.

            </p>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/explore"
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
              >

                <Map size={19} />

                Explore Heritage

                <ArrowRight size={18} />

              </Link>

              <Link
                to="/snap"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
              >
                <Camera size={19} />
                Snap & Identify
              </Link>

            </div>

            {/* FEATURES */}

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">

              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={18}
                  className="text-emerald-600"
                />

                Verified Heritage

              </div>

              <div className="flex items-center gap-2">

                <Languages
                  size={18}
                  className="text-blue-600"
                />

                Multilingual

              </div>

              <div className="flex items-center gap-2">

                <Bot
                  size={18}
                  className="text-purple-600"
                />

                AI Guide

              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl shadow-2xl">

              <img
                src={heroImage}
                alt="Indian heritage"
                className="h-125 w-full object-cover"
              />

            </div>

            {/* VERIFIED CARD */}

            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-emerald-100 p-3">

                  <ShieldCheck
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <p className="font-bold text-slate-900">
                    Verified Heritage
                  </p>

                  <p className="text-sm text-slate-500">
                    Authentic cultural knowledge
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12 text-center">

          <p className="font-semibold text-orange-600">
            EXPLORE BHARAT
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Heritage, reimagined with AI.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">

            One platform to discover, identify, understand and learn
            about India's diverse cultural heritage.

          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <FeatureCard
            icon={<Map />}
            title="Interactive Heritage Map"
            description="Explore monuments, traditions and crafts across India."
          />

          <FeatureCard
            icon={<Bot />}
            title="AI Heritage Guide"
            description="Ask questions and get contextual answers about heritage."
          />

          <FeatureCard
            icon={<Camera />}
            title="Snap & Identify"
            description="Upload a heritage image and let AI identify it."
          />

        </div>

      </section>

    </div>
  );
}


/* ================= FEATURE CARD ================= */

function FeatureCard({
  icon,
  title,
  description,
}) {

  return (

    <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

        {icon}

      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>

  );
}