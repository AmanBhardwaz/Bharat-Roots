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
import { API_BASE_URL } from "../config";


const SUPPORTED_LANGUAGES = [
  { code: "en-IN", name: "English", label: "English" },
  { code: "hi-IN", name: "Hindi", label: "हिंदी" },
  { code: "bn-IN", name: "Bengali", label: "বাংলা" },
  { code: "te-IN", name: "Telugu", label: "తెలుగు" },
  { code: "ta-IN", name: "Tamil", label: "தமிழ்" },
  { code: "mr-IN", name: "Marathi", label: "मराठी" },
  { code: "gu-IN", name: "Gujarati", label: "ગુજરાતી" },
  { code: "kn-IN", name: "Kannada", label: "ಕನ್ನಡ" },
];


export default function AIGuide() {

  const location = useLocation();

  // Heritage data passed from HeritageDetails.jsx
  const heritage = location.state?.heritage;

  const siteName = heritage?.name || "Indian Heritage";


  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);

  // -----------------------------
  // CHAT STATE
  // -----------------------------

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [interactionId, setInteractionId] = useState(null);


  const [messages, setMessages] = useState([
    {
      role: "assistant",

      text: heritage
        ? `Namaste! 🙏 I'm Bharat AI. Ask me anything about ${siteName}, its history, architecture, stories or cultural significance.`
        : "Namaste! 🙏 I'm Bharat AI. Ask me anything about Indian heritage, history, monuments, or culture generally!",
    },
  ]);


  // -----------------------------
  // VOICE OUTPUT
  // -----------------------------

  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const synthRef = useRef(window.speechSynthesis);


  const speak = (text, index) => {
    synthRef.current.cancel();

    const cleanText = text
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voices = synthRef.current.getVoices();
    const preferred =
      voices.find((v) => v.lang === selectedLang.code) ||
      voices.find((v) => v.lang.startsWith(selectedLang.code.split('-')[0])) ||
      voices.find((v) => v.lang === 'hi-IN') ||
      voices.find((v) => v.lang === 'en-IN') ||
      voices.find((v) => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    synthRef.current.speak(utterance);
  };


  const stopSpeaking = () => {
    synthRef.current.cancel();
    setSpeakingIndex(null);
  };


  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);


  // -----------------------------
  // VOICE INPUT (MIC)
  // -----------------------------

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);


  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang.code;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      setInput(transcript);

      // Auto-send when final result is received
      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false);
        if (transcript.trim()) {
          setTimeout(() => sendMessageRef.current?.(transcript.trim()), 300);
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [selectedLang.code]);


  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Stop any ongoing speech so mic doesn't pick it up
      stopSpeaking();
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  // -----------------------------
  // SUGGESTED QUESTIONS
  // -----------------------------

  const suggestedQuestions = heritage
    ? [
        `Why is ${siteName} important?`,
        `Tell me an interesting story about it.`,
        `Explain its architecture simply.`,
        `What should I know before visiting?`,
      ]
    : [
        "Why is Indian heritage important?",
        "Tell me about India's cultural heritage.",
        "What are some famous heritage sites in India?",
      ];


  // -----------------------------
  // SEND MESSAGE
  // -----------------------------

  const sendMessage = async (question = input) => {

    const text = question.trim();

    if (!text || isLoading) {
      return;
    }


    // Add user's message immediately
    setMessages((prev) => [
      ...prev,

      {
        role: "user",
        text,
      },
    ]);


    setInput("");

    setIsLoading(true);


    try {

      const response = await fetch(
        `${API_BASE_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            question: text,

            heritage_id: heritage?.id || null,

            previous_interaction_id:
              interactionId,

            language: selectedLang.name,

          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Bharat AI could not process your question."
        );

      }


      // Add Gemini response with typewriter effect
      const aiText = data.answer || "I couldn't generate an answer right now.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "" },
      ]);

      let currentText = "";
      let charIndex = 0;
      const speed = 10; // milliseconds per step
      const step = 3;   // characters per step for smooth fast rendering

      const timer = setInterval(() => {
        if (charIndex < aiText.length) {
          currentText = aiText.substring(0, charIndex + step);
          charIndex += step;
          setMessages((prev) => {
            const newMsgs = [...prev];
            if (newMsgs.length > 0) {
              newMsgs[newMsgs.length - 1] = {
                role: "assistant",
                text: currentText,
              };
            }
            return newMsgs;
          });
        } else {
          clearInterval(timer);
        }
      }, speed);

      // Auto-speak if voice is on
      if (autoSpeak) {
        speak(aiText, messages.length + 1);
      }


      // Save conversation ID
      if (data.interaction_id) {

        setInteractionId(
          data.interaction_id
        );

      }

    } catch (error) {

      console.error(
        "Bharat AI error:",
        error
      );


      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          text:
            "Sorry, I couldn't connect to Bharat AI right now. Please make sure the backend and Gemini API are running.",
        },
      ]);

    } finally {

      setIsLoading(false);

    }

  };

  // Keep ref current for voice input callback
  sendMessageRef.current = sendMessage;


  // -----------------------------
  // UI
  // -----------------------------

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <main className="mx-auto flex max-w-6xl flex-col px-4 pb-10 pt-28 sm:px-6">


        {/* ================= HEADER ================= */}

        <div className="mb-6">

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
          >

            <ArrowLeft size={17} />

            Back to Explore

          </Link>

        </div>


        {/* ================= AI CONTAINER ================= */}

        <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">


          {/* ================= AI HEADER ================= */}

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


          {/* ================= HERITAGE CONTEXT ================= */}

          <div className="border-b border-slate-700 px-6 py-5 sm:px-7">

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">

                Exploring: {siteName}

              </span>


              <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                heritage
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}>

                <ShieldCheck size={15} />

                {heritage ? "Verified Knowledge" : "General Knowledge"}

              </span>



              <div className="relative ml-auto">
                <select
                  value={selectedLang.code}
                  onChange={(e) => {
                    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === e.target.value);
                    if (lang) setSelectedLang(lang);
                  }}
                  className="rounded-full bg-slate-800 border border-slate-700 text-slate-300 pl-4 pr-10 py-2 text-sm font-semibold outline-none focus:border-orange-500 transition cursor-pointer appearance-none"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                      {lang.label} ({lang.name})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <Languages size={15} />
                </div>
              </div>


              <button
                onClick={() => {
                  setAutoSpeak((prev) => !prev);
                  if (autoSpeak) stopSpeaking();
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  autoSpeak
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {autoSpeak ? <Volume2 size={15} /> : <VolumeX size={15} />}
                {autoSpeak ? "Voice On" : "Voice Off"}
              </button>

            </div>

          </div>


          {/* ================= CHAT AREA ================= */}

          <div className="min-h-[500px] bg-slate-950 p-4 sm:p-6 md:p-8">

            <div className="mx-auto max-w-3xl">


              {/* ================= MESSAGES ================= */}

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`mb-6 flex gap-3 ${
                      message.role === "user"
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


                    {/* MESSAGE + VOICE */}

                    <div className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[80%]`}>

                      <div
                        className={`rounded-2xl px-5 py-4 text-sm leading-7 ${
                          message.role === "user"
                            ? "bg-orange-600 text-white"
                            : "bg-slate-800 text-slate-200"
                        }`}
                      >
                        {message.text}
                      </div>

                      {message.role === "assistant" && (
                        <button
                          onClick={() =>
                            speakingIndex === index
                              ? stopSpeaking()
                              : speak(message.text, index)
                          }
                          className={`flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            speakingIndex === index
                              ? "bg-orange-500/20 text-orange-400"
                              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {speakingIndex === index ? (
                            <>
                              <Square size={11} fill="currentColor" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Volume2 size={14} />
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


              {/* ================= LOADING ================= */}

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


              {/* ================= SUGGESTIONS ================= */}

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


          {/* ================= INPUT ================= */}

          <div className="border-t border-slate-700 bg-slate-900 p-4 sm:p-5">

            <div className="mx-auto flex max-w-3xl items-center gap-2 sm:gap-3">


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
                      event.key ===
                        "Enter" &&
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


              {/* MIC */}

              <button
                onClick={toggleMic}
                disabled={isLoading}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                  isListening
                    ? "animate-pulse bg-red-500 text-white"
                    : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-orange-500 hover:text-orange-400"
                } disabled:cursor-not-allowed disabled:opacity-50`}
                title={isListening ? "Stop listening" : "Speak your question"}
              >
                {isListening ? <MicOff size={19} /> : <Mic size={19} />}
              </button>


              {/* SEND */}

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


        {/* ================= INFO ================= */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-center text-sm text-slate-500">

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="shrink-0 text-emerald-600" />
            Verified heritage context
          </span>

          <span className="flex items-center gap-1.5">
            <Volume2 size={14} className="shrink-0 text-orange-500" />
            Auto voice replies
          </span>

          <span className="flex items-center gap-1.5">
            <Mic size={14} className="shrink-0 text-blue-500" />
            Ask by voice
          </span>

        </div>

      </main>

    </div>

  );
}