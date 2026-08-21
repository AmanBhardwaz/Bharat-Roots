import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Languages,
  LoaderCircle,
  Volume2,
  VolumeX,
  Square,
  Mic,
  MicOff,
} from "lucide-react";

import Navbar from "../components/Navbar";


// =====================================================
// SUPPORTED LANGUAGES
// =====================================================

const SUPPORTED_LANGUAGES = [
  {
    code: "en-IN",
    name: "English",
    label: "English",
  },
  {
    code: "hi-IN",
    name: "Hindi",
    label: "हिंदी",
  },
  {
    code: "bn-IN",
    name: "Bengali",
    label: "বাংলা",
  },
  {
    code: "te-IN",
    name: "Telugu",
    label: "తెలుగు",
  },
  {
    code: "ta-IN",
    name: "Tamil",
    label: "தமிழ்",
  },
  {
    code: "mr-IN",
    name: "Marathi",
    label: "मराठी",
  },
  {
    code: "gu-IN",
    name: "Gujarati",
    label: "ગુજરાતી",
  },
  {
    code: "kn-IN",
    name: "Kannada",
    label: "ಕನ್ನಡ",
  },
];


// =====================================================
// TRAVEL FALLBACK
// Gemini fail hone par ye answers use honge
// =====================================================

const getTravelFallback = (question, siteName) => {

  const q = question.toLowerCase();


  // -----------------------------------------
  // TRAVEL / TRIP PLANNING
  // -----------------------------------------

  if (
    q.includes("visit") ||
    q.includes("travel") ||
    q.includes("trip") ||
    q.includes("tour") ||
    q.includes("plan")
  ) {

    return `If you're planning a trip to ${siteName}, try to visit early in the morning or later in the afternoon to avoid peak crowds. Keep enough time to explore the monument and its surroundings. Carry water, comfortable footwear, sun protection, and check the latest opening hours before travelling. You can also explore nearby cultural attractions, local markets and regional food to make the trip more meaningful.`;

  }


  // -----------------------------------------
  // NEARBY PLACES
  // -----------------------------------------

  if (
    q.includes("nearby") ||
    q.includes("near ") ||
    q.includes("around") ||
    q.includes("surrounding")
  ) {

    return `While visiting ${siteName}, don't limit your trip to the main monument. Explore nearby heritage attractions, local markets, traditional food spots and cultural experiences. Keeping a few extra hours for the surrounding area can give you a much better experience of the local culture.`;

  }


  // -----------------------------------------
  // FOOD
  // -----------------------------------------

  if (
    q.includes("food") ||
    q.includes("eat") ||
    q.includes("restaurant") ||
    q.includes("cuisine") ||
    q.includes("dish")
  ) {

    return `During your visit to ${siteName}, try some authentic regional food from the local area. Traditional markets and local food streets are often great places to experience the culture beyond the monument. Look for regional specialities rather than only familiar tourist options.`;

  }


  // -----------------------------------------
  // BEST TIME
  // -----------------------------------------

  if (
    q.includes("best time") ||
    q.includes("when should") ||
    q.includes("when to visit") ||
    q.includes("weather") ||
    q.includes("season")
  ) {

    return `For a comfortable visit to ${siteName}, early morning or late afternoon is usually a good choice. Before travelling, check the local weather and the monument's current opening timings. If you're visiting during a busy season or festival period, expect larger crowds and plan accordingly.`;

  }


  // -----------------------------------------
  // TICKET / ENTRY
  // -----------------------------------------

  if (
    q.includes("ticket") ||
    q.includes("entry") ||
    q.includes("fee") ||
    q.includes("price") ||
    q.includes("cost")
  ) {

    return `Before visiting ${siteName}, check the latest official ticket prices, entry rules and opening hours because these details can change. For a smoother visit, keep your identification and a digital payment option handy. If possible, check official tourism or monument information before travelling.`;

  }


  // -----------------------------------------
  // SAFETY
  // -----------------------------------------

  if (
    q.includes("safe") ||
    q.includes("safety") ||
    q.includes("precaution") ||
    q.includes("careful")
  ) {

    return `While visiting ${siteName}, follow the monument's visitor rules and respect restricted areas. Keep your belongings secure, stay hydrated and avoid touching or climbing on protected structures. Comfortable footwear is also useful if the visit involves a lot of walking.`;

  }


  // -----------------------------------------
  // PHOTOGRAPHY
  // -----------------------------------------

  if (
    q.includes("photo") ||
    q.includes("photography") ||
    q.includes("camera") ||
    q.includes("picture")
  ) {

    return `For photographs at ${siteName}, early morning and late afternoon can offer pleasant natural light. Before using a camera or tripod, check the site's photography rules. Remember that preserving the monument is more important than getting the perfect photograph.`;

  }


  // -----------------------------------------
  // IMPORTANT / FAMOUS
  // -----------------------------------------

  if (
    q.includes("important") ||
    q.includes("famous") ||
    q.includes("significance") ||
    q.includes("special")
  ) {

    return `${siteName} is an important part of India's cultural heritage. A visit becomes more meaningful when you look beyond the monument itself and understand its history, architecture, craftsmanship, traditions and connection with the local community.`;

  }


  // -----------------------------------------
  // STORY
  // -----------------------------------------

  if (
    q.includes("story") ||
    q.includes("interesting") ||
    q.includes("legend") ||
    q.includes("tale")
  ) {

    return `One of the best ways to experience ${siteName} is to look beyond its physical structure and learn about the people, traditions, craftsmanship and stories connected with it. Ask Bharat AI about its history, architecture or local traditions to explore the site from different perspectives.`;

  }


  // -----------------------------------------
  // ARCHITECTURE
  // -----------------------------------------

  if (
    q.includes("architecture") ||
    q.includes("design") ||
    q.includes("structure") ||
    q.includes("built")
  ) {

    return `${siteName} reflects India's rich architectural heritage. During your visit, pay attention to the structure, decorative details, craftsmanship, symmetry and the way the monument reflects the culture and artistic traditions of its period.`;

  }


  // -----------------------------------------
  // DURATION
  // -----------------------------------------

  if (
    q.includes("how long") ||
    q.includes("hours") ||
    q.includes("time") ||
    q.includes("duration")
  ) {

    return `For ${siteName}, plan enough time to explore the main monument without rushing. Around two to three hours is a reasonable starting point for many heritage visits, but you may want more time if you also plan to explore nearby attractions, markets or cultural experiences.`;

  }


  // -----------------------------------------
  // DEFAULT TRAVEL RESPONSE
  // -----------------------------------------

  return `If you're planning to visit ${siteName}, try to experience more than just the main monument. Learn about its history, explore nearby attractions, try local food, respect local traditions and keep some extra time for discovering the surrounding area. Before travelling, always check the latest timings, entry rules and local travel information.`;

};


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function AIGuide() {

  const location = useLocation();


  // Heritage details se data aa raha hai
  const heritage = location.state?.heritage;


  const siteName =
    heritage?.name ||
    "Indian Heritage";


  // ===================================================
  // LANGUAGE
  // ===================================================

  const [selectedLang, setSelectedLang] =
    useState(
      SUPPORTED_LANGUAGES[0]
    );


  // ===================================================
  // CHAT STATE
  // ===================================================

  const [input, setInput] =
    useState("");


  const [isLoading, setIsLoading] =
    useState(false);


  const [interactionId, setInteractionId] =
    useState(null);


  const [messages, setMessages] =
    useState([
      {
        role: "assistant",

        text: heritage
          ? `Namaste! 🙏 I'm Bharat AI. Ask me anything about ${siteName}, including travel tips, history, architecture, stories, nearby experiences or cultural significance.`
          : "Namaste! 🙏 I'm Bharat AI. Ask me anything about Indian heritage, history, monuments, travel or culture.",
      },
    ]);


  // ===================================================
  // VOICE OUTPUT
  // ===================================================

  const [autoSpeak, setAutoSpeak] =
    useState(true);


  const [speakingIndex, setSpeakingIndex] =
    useState(null);


  const synthRef =
    useRef(
      window.speechSynthesis
    );


  // ===================================================
  // SPEAK
  // ===================================================

  const speak = (text, index) => {

    if (!text) {
      return;
    }


    synthRef.current.cancel();


    const cleanText =
      text
        .replace(
          /[\u{1F000}-\u{1FFFF}]/gu,
          ""
        )
        .replace(
          /[\u{2600}-\u{27BF}]/gu,
          ""
        )
        .replace(
          /\*\*(.*?)\*\*/g,
          "$1"
        )
        .replace(
          /\*(.*?)\*/g,
          "$1"
        )
        .replace(
          /#{1,6}\s/g,
          ""
        )
        .replace(
          /\n+/g,
          ". "
        );


    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      );


    const voices =
      synthRef.current.getVoices();


    const preferred =
      voices.find(
        (voice) =>
          voice.lang ===
          selectedLang.code
      ) ||
      voices.find(
        (voice) =>
          voice.lang.startsWith(
            selectedLang.code.split("-")[0]
          )
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "hi-IN"
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "en-IN"
      ) ||
      voices.find(
        (voice) =>
          voice.lang.startsWith("en")
      );


    if (preferred) {
      utterance.voice = preferred;
    }


    utterance.rate = 0.95;

    utterance.pitch = 1;


    utterance.onend = () => {
      setSpeakingIndex(null);
    };


    utterance.onerror = () => {
      setSpeakingIndex(null);
    };


    setSpeakingIndex(index);


    synthRef.current.speak(
      utterance
    );

  };


  // ===================================================
  // STOP SPEAKING
  // ===================================================

  const stopSpeaking = () => {

    synthRef.current.cancel();

    setSpeakingIndex(null);

  };


  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {

    return () => {
      window.speechSynthesis.cancel();
    };

  }, []);


  // ===================================================
  // VOICE INPUT
  // ===================================================

  const [isListening, setIsListening] =
    useState(false);


  const recognitionRef =
    useRef(null);


  const sendMessageRef =
    useRef(null);


  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {
      return;
    }


    const recognition =
      new SpeechRecognition();


    recognition.lang =
      selectedLang.code;


    recognition.interimResults =
      true;


    recognition.continuous =
      false;


    recognition.onresult =
      (event) => {

        const transcript =
          Array.from(
            event.results
          )
            .map(
              (result) =>
                result[0].transcript
            )
            .join("");


        setInput(
          transcript
        );


        if (
          event.results[
            event.results.length - 1
          ].isFinal
        ) {

          setIsListening(false);


          if (
            transcript.trim()
          ) {

            setTimeout(() => {

              sendMessageRef.current?.(
                transcript.trim()
              );

            }, 300);

          }

        }

      };


    recognition.onerror =
      () => {

        setIsListening(false);

      };


    recognition.onend =
      () => {

        setIsListening(false);

      };


    recognitionRef.current =
      recognition;


    return () => {

      recognition.abort();

    };

  }, [selectedLang.code]);


  // ===================================================
  // MIC TOGGLE
  // ===================================================

  const toggleMic = () => {

    if (
      !recognitionRef.current
    ) {

      alert(
        "Voice input is not supported in this browser."
      );

      return;

    }


    if (isListening) {

      recognitionRef.current.stop();

      setIsListening(false);

    } else {

      stopSpeaking();

      setInput("");


      recognitionRef.current.start();

      setIsListening(true);

    }

  };


  // ===================================================
  // SUGGESTED QUESTIONS
  // ===================================================

  const suggestedQuestions =
    heritage
      ? [
          `How should I plan a trip to ${siteName}?`,
          `What is the best time to visit?`,
          `What food should I try nearby?`,
          `What places can I explore around ${siteName}?`,
        ]
      : [
          "How should I plan a heritage trip in India?",
          "What are some must-visit heritage places?",
          "What cultural experiences should I try?",
          "What should I know before travelling?",
        ];


  // ===================================================
  // SEND MESSAGE
  // ===================================================

  const sendMessage =
    async (question = input) => {

      const text =
        question.trim();


      if (
        !text ||
        isLoading
      ) {

        return;

      }


      // ---------------------------------------------
      // USER MESSAGE
      // ---------------------------------------------

      setMessages(
        (prev) => [
          ...prev,

          {
            role: "user",
            text,
          },

        ]
      );


      setInput("");

      setIsLoading(true);


      try {

        // -------------------------------------------
        // GEMINI REQUEST
        // -------------------------------------------

        const response =
          await fetch(
            "http://127.0.0.1:8000/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                question: text,

                heritage_id:
                  heritage?.id ||
                  null,

                previous_interaction_id:
                  interactionId,

                language:
                  selectedLang.name,

              }),

            }
          );


        const data =
          await response.json();


        // -------------------------------------------
        // GEMINI SUCCESS
        // -------------------------------------------

        if (
          response.ok &&
          data.answer
        ) {

          const aiText =
            data.answer;


          setMessages(
            (prev) => [
              ...prev,

              {
                role: "assistant",
                text: aiText,
              },

            ]
          );


          // Save conversation ID
          if (
            data.interaction_id
          ) {

            setInteractionId(
              data.interaction_id
            );

          }


          // Voice
          if (autoSpeak) {

            setTimeout(() => {

              speak(
                aiText,
                messages.length + 1
              );

            }, 100);

          }


          return;

        }


        // If Gemini returned an error,
        // fallback will be used.

        throw new Error(
          data.detail ||
          "Gemini unavailable"
        );

      } catch (error) {

        // -------------------------------------------
        // GEMINI FAILED
        // -------------------------------------------

        console.warn(
          "Gemini unavailable. Using travel fallback.",
          error
        );


        // -------------------------------------------
        // HARD-CODED TRAVEL ANSWER
        // -------------------------------------------

        const fallbackAnswer =
          getTravelFallback(
            text,
            siteName
          );


        setMessages(
          (prev) => [
            ...prev,

            {
              role: "assistant",
              text: fallbackAnswer,
            },

          ]
        );


        // Voice fallback
        if (autoSpeak) {

          setTimeout(() => {

            speak(
              fallbackAnswer,
              messages.length + 1
            );

          }, 100);

        }

      } finally {

        setIsLoading(false);

      }

    };


  // Voice callback always gets
  // latest sendMessage
  sendMessageRef.current =
    sendMessage;


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <main className="mx-auto flex max-w-6xl flex-col px-4 pb-10 pt-28 sm:px-6">


        {/* =================================================
            BACK
        ================================================= */}

        <div className="mb-6">

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
          >

            <ArrowLeft size={17} />

            Back to Explore

          </Link>

        </div>


        {/* =================================================
            AI CONTAINER
        ================================================= */}

        <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white sm:p-7">

            <div className="flex items-center gap-4">


              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">

                <Bot size={29} />

              </div>


              <div>

                <div className="flex items-center gap-2">

                  <p className="text-sm font-semibold text-orange-100">
                    BHARAT AI
                  </p>

                  <Sparkles size={15} />

                </div>


                <h1 className="text-2xl font-black md:text-3xl">
                  Your Heritage Guide
                </h1>

              </div>

            </div>

          </div>


          {/* =================================================
              CONTEXT BAR
          ================================================= */}

          <div className="border-b border-slate-700 px-6 py-5 sm:px-7">

            <div className="flex flex-wrap items-center gap-3">


              {/* Heritage */}

              <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">

                Exploring: {siteName}

              </span>


              {/* Verification */}

              <span
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                  heritage
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >

                <ShieldCheck size={15} />

                {heritage
                  ? "Verified Knowledge"
                  : "General Knowledge"}

              </span>


              {/* Language */}

              <div className="relative ml-auto">

                <select
                  value={
                    selectedLang.code
                  }
                  onChange={(e) => {

                    const lang =
                      SUPPORTED_LANGUAGES.find(
                        (item) =>
                          item.code ===
                          e.target.value
                      );


                    if (lang) {

                      setSelectedLang(
                        lang
                      );

                    }

                  }}
                  className="cursor-pointer appearance-none rounded-full border border-slate-700 bg-slate-800 py-2 pl-4 pr-10 text-sm font-semibold text-slate-300 outline-none transition focus:border-orange-500"
                >

                  {SUPPORTED_LANGUAGES.map(
                    (lang) => (

                      <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-slate-900 text-slate-200"
                      >

                        {lang.label} (
                        {lang.name}
                        )

                      </option>

                    )
                  )}

                </select>


                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">

                  <Languages size={15} />

                </div>

              </div>


              {/* Voice toggle */}

              <button
                onClick={() => {

                  setAutoSpeak(
                    (prev) => !prev
                  );


                  if (autoSpeak) {
                    stopSpeaking();
                  }

                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  autoSpeak
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >

                {autoSpeak ? (
                  <Volume2 size={15} />
                ) : (
                  <VolumeX size={15} />
                )}

                {autoSpeak
                  ? "Voice On"
                  : "Voice Off"}

              </button>

            </div>

          </div>


          {/* =================================================
              CHAT
          ================================================= */}

          <div className="min-h-[500px] bg-slate-950 p-4 sm:p-6 md:p-8">

            <div className="mx-auto max-w-3xl">


              {/* MESSAGES */}

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`mb-6 flex gap-3 ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >


                    {/* AI ICON */}

                    {message.role ===
                      "assistant" && (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">

                        <Bot size={17} />

                      </div>

                    )}


                    {/* MESSAGE */}

                    <div className="flex max-w-[85%] flex-col gap-1 sm:max-w-[80%]">


                      <div
                        className={`rounded-2xl px-5 py-4 text-sm leading-7 ${
                          message.role ===
                          "user"
                            ? "bg-orange-600 text-white"
                            : "bg-slate-800 text-slate-200"
                        }`}
                      >

                        {message.text}

                      </div>


                      {/* Listen button */}

                      {message.role ===
                        "assistant" && (

                        <button
                          onClick={() => {

                            if (
                              speakingIndex ===
                              index
                            ) {

                              stopSpeaking();

                            } else {

                              speak(
                                message.text,
                                index
                              );

                            }

                          }}
                          className={`flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            speakingIndex ===
                            index
                              ? "bg-orange-500/20 text-orange-400"
                              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                          }`}
                        >

                          {speakingIndex ===
                          index ? (
                            <>
                              <Square
                                size={11}
                                fill="currentColor"
                              />

                              Stop
                            </>
                          ) : (
                            <>
                              <Volume2
                                size={14}
                              />

                              Listen
                            </>
                          )}

                        </button>

                      )}

                    </div>


                    {/* USER ICON */}

                    {message.role ===
                      "user" && (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-slate-300">

                        <User size={17} />

                      </div>

                    )}

                  </div>

                )
              )}


              {/* =================================================
                  LOADING
              ================================================= */}

              {isLoading && (

                <div className="mb-6 flex gap-3">


                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">

                    <Bot size={17} />

                  </div>


                  <div className="flex items-center gap-3 rounded-2xl bg-slate-800 px-5 py-4 text-sm text-slate-400">

                    <LoaderCircle
                      size={17}
                      className="animate-spin text-orange-400"
                    />

                    Bharat AI is thinking...

                  </div>

                </div>

              )}


              {/* =================================================
                  SUGGESTIONS
              ================================================= */}

              {!isLoading && (

                <div className="mt-8">


                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">

                    Suggested questions

                  </p>


                  <div className="flex flex-wrap gap-2">

                    {suggestedQuestions.map(
                      (question) => (

                        <button
                          key={question}
                          onClick={() =>
                            sendMessage(
                              question
                            )
                          }
                          disabled={isLoading}
                          className="rounded-xl border border-slate-700 px-4 py-2.5 text-left text-sm text-slate-300 transition hover:border-orange-500 hover:bg-slate-800 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {question}

                        </button>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              INPUT
          ================================================= */}

          <div className="border-t border-slate-700 bg-slate-900 p-4 sm:p-5">

            <div className="mx-auto flex max-w-3xl items-center gap-2 sm:gap-3">


              {/* INPUT BOX */}

              <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-slate-700 bg-slate-800 px-3 sm:px-4">


                <input
                  value={input}

                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }

                  onKeyDown={(event) => {
  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    sendMessage();
  }
}}

                  disabled={isLoading}

                  placeholder={
                    isListening
                      ? "Listening... speak now"
                      : `Type or tap 🎤 to ask about ${siteName}...`
                  }

                  className="w-full min-w-0 bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
                />

              </div>


              {/* =================================================
                  MIC
              ================================================= */}

              <button
                onClick={
                  toggleMic
                }
                disabled={
                  isLoading
                }
                title={
                  isListening
                    ? "Stop listening"
                    : "Speak your question"
                }
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                  isListening
                    ? "animate-pulse bg-red-500 text-white"
                    : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-orange-500 hover:text-orange-400"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >

                {isListening ? (
                  <MicOff size={19} />
                ) : (
                  <Mic size={19} />
                )}

              </button>


              {/* =================================================
                  SEND
              ================================================= */}

              <button
                onClick={() =>
                  sendMessage()
                }
                disabled={
                  isLoading ||
                  !input.trim()
                }
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isLoading ? (

                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />

                ) : (

                  <Send size={19} />

                )}

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            INFO
        ================================================= */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-center text-sm text-slate-500">


          <span className="flex items-center gap-1.5">

            <ShieldCheck
              size={14}
              className="shrink-0 text-emerald-600"
            />

            Verified heritage context

          </span>


          <span className="flex items-center gap-1.5">

            <Volume2
              size={14}
              className="shrink-0 text-orange-500"
            />

            Auto voice replies

          </span>


          <span className="flex items-center gap-1.5">

            <Mic
              size={14}
              className="shrink-0 text-blue-500"
            />

            Ask by voice

          </span>

        </div>

      </main>

    </div>

  );

}