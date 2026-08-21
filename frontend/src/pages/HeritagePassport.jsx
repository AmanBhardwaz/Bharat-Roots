import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Compass,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { heritageSites } from "../data/heritageData";

const STORAGE_KEY = "bharat_roots_passport";

export default function HeritagePassport() {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedIds)
    );
  }, [savedIds]);

  const savedSites = useMemo(() => {
    return heritageSites.filter((site) =>
      savedIds.includes(site.id)
    );
  }, [savedIds]);

  const statesVisited = new Set(
    savedSites.map((site) => site.state)
  ).size;

  const removeSite = (id) => {
    setSavedIds((prev) =>
      prev.filter((savedId) => savedId !== id)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">

        {/* BACK */}

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={17} />
          Back to Explore
        </Link>


        {/* HERO */}

        <section className="mt-7 overflow-hidden rounded-3xl bg-slate-900 shadow-xl">

          <div className="relative overflow-hidden px-7 py-12 md:px-12 md:py-16">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative max-w-3xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <BookOpen size={27} />
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-wider text-orange-400">
                YOUR CULTURAL JOURNEY
              </p>

              <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
                My WishList
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Save the places you've discovered and build
                your personal collection of India's cultural heritage.
              </p>

            </div>

          </div>


          {/* STATS */}

          <div className="grid border-t border-slate-700 sm:grid-cols-3">

            <PassportStat
              icon={<Trophy size={20} />}
              value={savedSites.length}
              label="Sites Discovered"
            />

            <PassportStat
              icon={<MapPin size={20} />}
              value={statesVisited}
              label="States Explored"
            />

            <PassportStat
              icon={<ShieldCheck size={20} />}
              value={savedSites.filter(
                (site) => site.verified
              ).length}
              label="Verified Sites"
            />

          </div>

        </section>


        {/* CONTENT */}

        <section className="mt-12">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                COLLECTION
              </p>

              <h2 className="mt-1 text-3xl font-black text-slate-900">
                Your Heritage WishList
              </h2>

            </div>

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              <Compass size={17} />
              Discover More
            </Link>

          </div>


          {/* EMPTY STATE */}

          {savedSites.length === 0 && (

            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Heart size={28} />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                Your WishList is empty
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-500">
                Start exploring India's heritage and save
                the places that inspire you.
              </p>

              <Link
                to="/explore"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700"
              >
                <Compass size={18} />
                Start Exploring
              </Link>

            </div>

          )}


          {/* SAVED SITES */}

          {savedSites.length > 0 && (

            <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {savedSites.map((site) => (

                <PassportCard
                  key={site.id}
                  site={site}
                  onRemove={() => removeSite(site.id)}
                />

              ))}

            </div>

          )}

        </section>


        {/* MOTIVATION */}

        <section className="mt-14 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-emerald-50 p-7 md:p-10">

          <div className="flex flex-col gap-5 md:flex-row md:items-center">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
              <Sparkles size={25} />
            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Keep discovering India's stories
              </h3>

              <p className="mt-1 max-w-2xl leading-7 text-slate-600">
                Every place you save becomes part of your
                personal heritage journey.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================
   STAT COMPONENT
========================= */

function PassportStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="flex items-center gap-4 px-7 py-5 md:px-10">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-orange-400">
        {icon}
      </div>

      <div>

        <p className="text-2xl font-black text-white">
          {value}
        </p>

        <p className="text-sm text-slate-400">
          {label}
        </p>

      </div>

    </div>
  );
}


/* =========================
   PASSPORT CARD
========================= */

function PassportCard({
  site,
  onRemove,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="relative h-56 overflow-hidden">

        <img
          src={site.image}
          alt={site.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />


        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />


        {site.verified && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">

            <ShieldCheck size={14} />

            Verified

          </div>
        )}


        <div className="absolute bottom-4 left-4">

          <p className="text-sm font-medium text-white/90">
            {site.city}, {site.state}
          </p>

          <h3 className="text-xl font-black text-white">
            {site.name}
          </h3>

        </div>

      </div>


      <div className="p-5">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <CheckCircle2
            size={16}
            className="text-emerald-600"
          />

          Added to your WishList

        </div>


        <div className="mt-5 flex gap-2">

          <Link
            to={`/heritage/${site.id}`}
            className="flex flex-1 items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            View Heritage
          </Link>

          <button
            onClick={onRemove}
            title="Remove from WishList"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <Heart
              size={18}
              fill="currentColor"
            />
          </button>

        </div>

      </div>

    </article>
  );
}