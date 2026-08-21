import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Bot,
  Languages,
  Heart,
  Share2,
  Calendar,
  Landmark,
  BookOpen,
  Check,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { heritageSites } from "../data/heritageData";


const STORAGE_KEY = "bharat_roots_passport";


export default function HeritageDetails() {

  const { id } = useParams();


  const site = heritageSites.find(
    (item) => item.id === Number(id)
  );


  // -----------------------------
  // SAVE STATE
  // -----------------------------

  const [isSaved, setIsSaved] = useState(false);


  // -----------------------------
  // LOAD SAVED STATE
  // -----------------------------

  useEffect(() => {

    if (!site) return;


    try {

      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );


      setIsSaved(
        saved.includes(site.id)
      );

    } catch (error) {

      console.error(
        "Could not load passport:",
        error
      );

    }

  }, [site]);


  // -----------------------------
  // AI CONTENT
  // -----------------------------

  const [aiContent, setAiContent] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!site) return;

    const fetchAiContent = async () => {
      setAiLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/heritage-info/${site.id}`
        );
        const data = await response.json();
        if (data.success) {
          setAiContent(data);
        }
      } catch (error) {
        console.error("Could not load AI content:", error);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAiContent();
  }, [site]);


  // -----------------------------
  // INVALID HERITAGE ID
  // -----------------------------

  if (!site) {

    return (

      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <h1 className="text-3xl font-bold text-slate-900">
              Heritage site not found
            </h1>

            <p className="mt-3 text-slate-500">
              The heritage information you're looking for
              is not available.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              <ArrowLeft size={18} />
              Back to Explore
            </Link>

          </div>

        </main>

      </div>

    );

  }


  // -----------------------------
  // SAVE / REMOVE FROM PASSPORT
  // -----------------------------

  const togglePassport = () => {

    try {

      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );


      if (saved.includes(site.id)) {

        const updated = saved.filter(
          (savedId) => savedId !== site.id
        );


        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );


        setIsSaved(false);

      } else {

        const updated = [
          ...saved,
          site.id,
        ];


        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );


        setIsSaved(true);

      }

    } catch (error) {

      console.error(
        "Could not update passport:",
        error
      );

    }

  };


  // -----------------------------
  // SHARE
  // -----------------------------

  const handleShare = async () => {

    try {

      if (navigator.share) {

        await navigator.share({
          title: site.name,
          text: `Explore ${site.name} on Bharat Roots.`,
          url: window.location.href,
        });

      } else {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Heritage link copied!");

      }

    } catch (error) {

      console.log(
        "Share cancelled or unavailable."
      );

    }

  };


  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">


        {/* ================= BACK BUTTON ================= */}

        <Link
          to="/explore"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
        >

          <ArrowLeft size={17} />

          Back to Explore

        </Link>


        {/* ================= HERO ================= */}

        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">


          <div className="relative h-[430px] md:h-[520px]">


            <img
              src={site.image}
              alt={site.name}
              className="h-full w-full object-cover"
            />


            {/* DARK OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />


            {/* HERO CONTENT */}

            <div className="absolute bottom-0 left-0 right-0 p-7 md:p-12">


              <div className="mb-4 flex flex-wrap gap-3">


                <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                  {site.category}
                </span>


                {site.verified && (

                  <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-emerald-700">

                    <ShieldCheck size={16} />

                    Verified Heritage

                  </span>

                )}

              </div>


              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                {site.name}
              </h1>


              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/90">


                <span className="flex items-center gap-2">

                  <MapPin size={17} />

                  {site.city}, {site.state}

                </span>


                <span className="flex items-center gap-2">

                  <Calendar size={17} />

                  {site.year}

                </span>


              </div>

            </div>

          </div>


          {/* ================= QUICK ACTIONS ================= */}

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-7 py-5 md:px-12">


            {/* SAVE / UNSAVE */}

            <button
              onClick={togglePassport}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                isSaved
                  ? "border-orange-300 bg-orange-50 text-orange-600"
                  : "border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600"
              }`}
            >

              {isSaved ? (
                <Check size={17} />
              ) : (
                <Heart size={17} />
              )}

              {isSaved
                ? "Saved to WishList"
                : "Save to WishList"}

            </button>


            {/* SHARE */}

            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
            >

              <Share2 size={17} />

              Share

            </button>


            {/* VERIFIED */}

            <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">

              <ShieldCheck
                size={17}
                className="text-emerald-600"
              />

              Verified cultural record

            </div>

          </div>


          {/* ================= MAIN CONTENT ================= */}

          <div className="grid gap-10 p-7 md:p-12 lg:grid-cols-3">


            {/* ================= LEFT CONTENT ================= */}

            <div className="lg:col-span-2">


              {/* ABOUT */}

              <section>


                <div className="flex items-center gap-3">


                  <div className="rounded-xl bg-orange-100 p-3 text-orange-600">

                    <Landmark size={22} />

                  </div>


                  <div>

                    <p className="text-sm font-semibold text-orange-600">
                      DISCOVER
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900">
                      About this Heritage
                    </h2>

                  </div>

                </div>


                {aiLoading ? (
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-11/12 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-10/12 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-9/12 animate-pulse rounded-lg bg-slate-200" />
                  </div>
                ) : (
                  <div className="mt-5 whitespace-pre-line text-lg leading-8 text-slate-600">
                    {aiContent?.description || site.description}
                  </div>
                )}

              </section>


              {/* HISTORY */}

              <section className="mt-12">


                <div className="flex items-center gap-3">


                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">

                    <BookOpen size={22} />

                  </div>


                  <div>

                    <p className="text-sm font-semibold text-blue-600">
                      HISTORY
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900">
                      The Story Behind {site.name}
                    </h2>

                  </div>

                </div>


                {aiLoading ? (
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-10/12 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-11/12 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-8/12 animate-pulse rounded-lg bg-slate-200" />
                  </div>
                ) : (
                  <div className="mt-5 whitespace-pre-line leading-8 text-slate-600">
                    {aiContent?.history || site?.history ||
                      `${site.name} is an important part of India's rich cultural and historical heritage.`}
                  </div>
                )}

              </section>


              {/* CULTURAL SIGNIFICANCE */}

              <section className="mt-12">


                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-emerald-50 p-7">


                  <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                    Cultural Significance
                  </p>


                  {aiLoading ? (
                    <div className="mt-4 space-y-3">
                      <div className="h-4 w-full animate-pulse rounded-lg bg-orange-100" />
                      <div className="h-4 w-11/12 animate-pulse rounded-lg bg-orange-100" />
                      <div className="h-4 w-9/12 animate-pulse rounded-lg bg-orange-100" />
                    </div>
                  ) : (
                    <div className="mt-4 whitespace-pre-line leading-8 text-slate-700">
                      {aiContent?.significance || site?.significance ||
                        `${site.name} represents an important part of India's architectural and cultural heritage.`}
                    </div>
                  )}

                </div>

              </section>


              {/* INTERESTING FACTS */}

              {(aiLoading || ((aiContent?.facts || site?.facts) && (aiContent?.facts || site?.facts).length > 0)) && (

                <section className="mt-12">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                      <Sparkles size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-purple-600">
                        DID YOU KNOW?
                      </p>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Interesting Facts
                      </h2>
                    </div>

                  </div>

                  {aiLoading ? (
                    <div className="mt-5 space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-4 animate-pulse rounded-lg bg-slate-200" style={{ width: `${85 - i * 5}%` }} />
                      ))}
                    </div>
                  ) : (
                    <ul className="mt-5 space-y-4">
                      {(aiContent?.facts || site?.facts || []).map((fact, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-600">
                            {index + 1}
                          </span>
                          <span className="leading-7 text-slate-700">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                </section>

              )}


              {/* AI BADGE */}

              {aiContent && (
                <div className="mt-10 flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm text-purple-700">
                  <Sparkles size={16} className="shrink-0" />
                  Content generated by Bharat AI for educational purposes.
                </div>
              )}


              {/* LOCATION */}

              <section className="mt-12">


                <h2 className="text-2xl font-bold text-slate-900">
                  Location
                </h2>


                <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">


                  <div className="rounded-xl bg-orange-100 p-3 text-orange-600">

                    <MapPin size={22} />

                  </div>


                  <div>

                    <p className="font-bold text-slate-900">
                      {site.city}, {site.state}
                    </p>


                    <p className="mt-1 text-sm text-slate-500">
                      Latitude: {site.latitude} · Longitude: {site.longitude}
                    </p>

                  </div>

                </div>

              </section>

            </div>


            {/* ================= AI PANEL ================= */}

            <aside>


              <div className="sticky top-28 overflow-hidden rounded-3xl bg-slate-900 shadow-xl">


                {/* AI HEADER */}

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-7 text-white">


                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">

                    <Bot size={28} />

                  </div>


                  <p className="text-sm font-semibold text-orange-100">
                    BHARAT AI
                  </p>


                  <h2 className="mt-1 text-2xl font-black">
                    Ask about {site.name}
                  </h2>


                  <p className="mt-3 text-sm leading-6 text-orange-50">

                    Explore history, architecture, stories and cultural
                    significance with your AI heritage guide.

                  </p>

                </div>


                {/* AI QUESTIONS */}

                <div className="p-6">


                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Try asking
                  </p>


                  <div className="mt-4 space-y-3">


                    <Link
                      to="/ai-guide"
                      state={{
                        heritage: site,
                        initialQuestion:
                          `Why is ${site.name} important?`,
                      }}
                      className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-orange-500 hover:bg-slate-800"
                    >
                      Why is this place important?
                    </Link>


                    <Link
                      to="/ai-guide"
                      state={{
                        heritage: site,
                        initialQuestion:
                          `Tell me an interesting story about ${site.name}.`,
                      }}
                      className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-orange-500 hover:bg-slate-800"
                    >
                      Tell me an interesting story.
                    </Link>


                    <Link
                      to="/ai-guide"
                      state={{
                        heritage: site,
                        initialQuestion:
                          `Explain the architecture of ${site.name} simply.`,
                      }}
                      className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-orange-500 hover:bg-slate-800"
                    >
                      Explain the architecture.
                    </Link>

                  </div>


                  {/* START AI */}

                  <Link
                    to="/ai-guide"
                    state={{ heritage: site }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600"
                  >

                    <Bot size={18} />

                    Start AI Conversation

                  </Link>


                  {/* LANGUAGE */}

                  <button
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >

                    <Languages size={17} />

                    English

                  </button>

                </div>

              </div>

            </aside>

          </div>

        </section>


        {/* ================= VERIFICATION ================= */}

        <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">


          <div className="flex items-start gap-4">


            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">

              <ShieldCheck size={23} />

            </div>


            <div>

              <h3 className="font-bold text-emerald-900">
                Verified Heritage Information
              </h3>


              <p className="mt-1 text-sm leading-6 text-emerald-800">

                This heritage record is marked as verified in the
                Bharat Roots archive. Source attribution and expert
                verification will be connected to the production
                knowledge base.

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>

  );
}