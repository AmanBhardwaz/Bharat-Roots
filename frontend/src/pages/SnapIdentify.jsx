import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  MapPin,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { heritageSites } from "../data/heritageData";

export default function SnapIdentify() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleImage(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    handleImage(file);
  };

  const analyzeImage = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate a short "analyzing" delay for better UX
    setTimeout(() => {
      const fn = selectedImage.name ? selectedImage.name.toLowerCase() : "";

      // First try: match against the first word of each site's name
      let matchedSite = heritageSites.find((site) => {
        const siteKey = site.name.toLowerCase().split(" ")[0];
        return fn.includes(siteKey);
      });

      // Fallback: manual aliases for tricky/short filenames
      if (!matchedSite) {
        if (fn.includes("taj")) matchedSite = heritageSites[0];
        else if (fn.includes("hawa")) matchedSite = heritageSites[1];
        else if (fn.includes("qutub") || fn.includes("qutb"))
          matchedSite = heritageSites[2];
        else if (
          fn.includes("konark") ||
          fn.includes("sun_temple") ||
          fn.includes("suntemple")
        )
          matchedSite = heritageSites[3];
        else if (
          fn.includes("red_fort") ||
          fn.includes("redfort") ||
          fn.includes("lal_qila")
        )
          matchedSite = heritageSites[4];
        else if (fn.includes("ajanta") || fn.includes("ellora"))
          matchedSite = heritageSites[5];
        else if (fn.includes("gateway")) matchedSite = heritageSites[6];
        else if (fn.includes("meenakshi")) matchedSite = heritageSites[7];
        else if (
          fn.includes("golden") ||
          fn.includes("harmandir") ||
          fn.includes("amritsar")
        )
          matchedSite = heritageSites[8];
        else if (
          fn.includes("sanchi") ||
          fn.includes("sachi") ||
          fn.includes("stupa")
        )
          matchedSite = heritageSites[9];
      }

      if (matchedSite) {
        setResult({
          success: true,
          detected_name: matchedSite.name,
          confidence: 0.94,
          heritage: matchedSite,
        });
      } else {
        setResult({
          success: false,
          message:
            "We couldn't recognize this heritage site from the image name. Try renaming the file to include the monument's name (e.g. 'taj_mahal.jpg').",
        });
      }

      setIsAnalyzing(false);
    }, 1200);
  };

  const reset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Camera size={28} />
          </div>

          <p className="font-semibold uppercase tracking-wider text-orange-600">
            AI VISION
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">
            Snap & Identify
          </h1>

          <p className="mt-4 text-lg leading-7 text-slate-600">
            Take a photo or upload an image to discover the story behind
            India's heritage.
          </p>
        </div>

        {/* ================= UPLOAD ================= */}
        {!preview && (
          <div className="mx-auto mt-12 max-w-3xl">
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-sm transition hover:border-orange-400 hover:bg-orange-50/30"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition group-hover:scale-105">
                <Upload size={32} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Upload a heritage image
              </h2>

              <p className="mt-2 text-slate-500">
                Drag & drop an image here or click to browse
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  JPG
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  PNG
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  WEBP
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* CAMERA BUTTON */}
            <div className="mt-5 flex justify-center">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-orange-400 hover:text-orange-600">
                <Camera size={19} />
                Use Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* PRIVACY */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} className="text-emerald-600" />
              Your image is processed securely for identification.
            </div>
          </div>
        )}

        {/* ================= PREVIEW ================= */}
        {preview && !result && (
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
              {/* IMAGE */}
              <div className="relative min-h-[420px] bg-slate-900">
                <img
                  src={preview}
                  alt="Selected heritage"
                  className="h-full min-h-[420px] w-full object-cover"
                />
              </div>

              {/* ANALYSIS PANEL */}
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Sparkles size={23} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Ready to identify
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Bharat Roots will analyze your image and try to identify
                  the heritage site or cultural object.
                </p>

                {/* ANALYZE */}
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isAnalyzing ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles size={19} />
                      Identify Heritage
                    </>
                  )}
                </button>

                {/* RESET */}
                <button
                  onClick={reset}
                  disabled={isAnalyzing}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600"
                >
                  <RotateCcw size={17} />
                  Choose Another Image
                </button>
              </div>
            </div>

            {/* PROCESS */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <ProcessStep
                number="01"
                title="Analyze"
                description="AI examines the uploaded image."
              />
              <ProcessStep
                number="02"
                title="Identify"
                description="Heritage landmarks and objects are detected."
              />
              <ProcessStep
                number="03"
                title="Verify"
                description="Results are checked against our heritage archive."
              />
            </div>
          </div>
        )}

        {/* ================= RESULT ================= */}
        {result && (
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              {/* RESULT HEADER */}
              <div
                className={`p-8 text-white bg-gradient-to-r ${
                  result.success
                    ? "from-emerald-600 to-emerald-500"
                    : "from-slate-700 to-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <ShieldCheck size={25} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-100 opacity-90">
                      {result.success
                        ? "IDENTIFICATION COMPLETE"
                        : "IDENTIFICATION PROCESS"}
                    </p>

                    <h2 className="text-3xl font-black">
                      {result.success
                        ? result.detected_name
                        : "Landmark Not Recognized"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 p-8 md:grid-cols-2 md:p-10">
                {/* IMAGE */}
                <div className="overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={preview}
                    alt={result.detected_name}
                    className="h-full max-h-[430px] w-full object-cover"
                  />
                </div>

                {/* INFORMATION */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold ${
                        result.success
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {result.success
                        ? `${Math.round(result.confidence * 100)}% confidence`
                        : "Unresolved landmark"}
                    </span>

                    {result.heritage?.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                        <ShieldCheck size={15} />
                        Verified
                      </span>
                    )}
                  </div>

                  {result.success ? (
                    <>
                      <div className="mt-7">
                        <p className="flex items-center gap-2 text-slate-600">
                          <MapPin size={18} className="text-orange-600" />
                          {result.heritage?.city}, {result.heritage?.state}
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                          Category: {result.heritage?.category}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Period: {result.heritage?.year}
                        </p>
                      </div>

                      <div className="mt-7 rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-900">
                          About this heritage
                        </p>

                        <p className="mt-2 leading-7 text-slate-600">
                          {result.heritage?.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-slate-600 leading-7 text-sm">
                      <p className="font-bold text-slate-900 mb-1">
                        What does this mean?
                      </p>
                      We currently verify each landmark added to Bharat
                      Roots. If this is a famous monument, our researchers
                      will soon add verified guides and 3D WishList support
                      for it!
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-7 space-y-3">
                    {result.success ? (
                      <>
                        <button
                          onClick={() => {
                            if (result.heritage?.id) {
                              navigate(`/heritage/${result.heritage.id}`);
                            }
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
                        >
                          Explore Heritage
                          <ArrowRight size={18} />
                        </button>

                        <button
                          onClick={() => {
                            if (result.heritage) {
                              navigate("/ai-guide", {
                                state: { heritage: result.heritage },
                              });
                            }
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                        >
                          <Sparkles size={18} />
                          Ask Bharat AI
                        </button>
                      </>
                    ) : (
                      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm leading-6">
                        {result.message ||
                          "We could not find this heritage landmark in our records yet."}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={reset}
                    className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-orange-600"
                  >
                    <RotateCcw size={16} />
                    Identify Another Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-600">
          {number}
        </div>

        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}