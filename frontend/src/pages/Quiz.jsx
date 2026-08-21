import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { heritageSites } from "../data/heritageData";


const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which city is home to the Hawa Mahal?",
    options: [
      "Jaipur",
      "Agra",
      "Delhi",
      "Udaipur",
    ],
    answer: "Jaipur",
  },

  {
    id: 2,
    question: "The Taj Mahal is located in which city?",
    options: [
      "Lucknow",
      "Agra",
      "Jaipur",
      "Bhopal",
    ],
    answer: "Agra",
  },

  {
    id: 3,
    question: "The Konark Sun Temple is located in which state?",
    options: [
      "Rajasthan",
      "Gujarat",
      "Odisha",
      "Madhya Pradesh",
    ],
    answer: "Odisha",
  },

  {
    id: 4,
    question: "Which of these is located in Delhi?",
    options: [
      "Qutub Minar",
      "Hawa Mahal",
      "Konark Sun Temple",
      "Taj Mahal",
    ],
    answer: "Qutub Minar",
  },

  {
    id: 5,
    question: "Hawa Mahal is especially known for its distinctive windows and façade.",
    options: [
      "True",
      "False",
      "Only during festivals",
      "Only from the inside",
    ],
    answer: "True",
  },
];


export default function Quiz() {

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);


  const question = QUIZ_QUESTIONS[currentQuestion];


  const progress = useMemo(() => {

    return (
      ((currentQuestion + 1) /
        QUIZ_QUESTIONS.length) *
      100
    );

  }, [currentQuestion]);


  const handleAnswer = (answer) => {

    if (selectedAnswer) {
      return;
    }


    setSelectedAnswer(answer);


    if (answer === question.answer) {

      setScore((prev) => prev + 1);

    }

  };


  const nextQuestion = () => {

    if (!selectedAnswer) {
      return;
    }


    if (
      currentQuestion ===
      QUIZ_QUESTIONS.length - 1
    ) {

      setFinished(true);

      return;

    }


    setCurrentQuestion(
      (prev) => prev + 1
    );

    setSelectedAnswer(null);

  };


  const restartQuiz = () => {

    setCurrentQuestion(0);

    setSelectedAnswer(null);

    setScore(0);

    setFinished(false);

  };


  const getResultMessage = () => {

    const percentage =
      (score / QUIZ_QUESTIONS.length) *
      100;


    if (percentage === 100) {
      return "Outstanding! You are a true Heritage Explorer.";
    }

    if (percentage >= 60) {
      return "Great job! Your heritage knowledge is growing.";
    }

    return "Good start! Keep exploring India's heritage to learn more.";
  };


  // =========================
  // RESULT SCREEN
  // =========================

  if (finished) {

    return (

      <div className="min-h-screen bg-slate-50">

        <Navbar />


        <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">


          <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">


            {/* RESULT HERO */}

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-12 text-center text-white md:px-12">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20">

                <Trophy size={38} />

              </div>


              <p className="mt-6 text-sm font-bold uppercase tracking-wider text-orange-100">
                QUIZ COMPLETE
              </p>


              <h1 className="mt-2 text-4xl font-black md:text-5xl">
                Heritage Explorer
              </h1>


              <p className="mt-4 text-orange-50">
                {getResultMessage()}
              </p>

            </div>


            {/* SCORE */}

            <div className="px-6 py-10 text-center md:px-12">

              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                YOUR SCORE
              </p>


              <div className="mt-3">

                <span className="text-6xl font-black text-white">
                  {score}
                </span>

                <span className="text-2xl font-bold text-slate-500">
                  {" "}
                  / {QUIZ_QUESTIONS.length}
                </span>

              </div>


              {/* SCORE BAR */}

              <div className="mx-auto mt-7 max-w-md">

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-700"
                    style={{
                      width: `${
                        (score /
                          QUIZ_QUESTIONS.length) *
                        100
                      }%`,
                    }}
                  />

                </div>

              </div>


              {/* ACTIONS */}

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                <button
                  onClick={restartQuiz}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
                >

                  <RotateCcw size={18} />

                  Try Again

                </button>


                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 font-bold text-slate-200 transition hover:bg-slate-800"
                >

                  Explore Heritage

                </Link>

              </div>

            </div>

          </div>


          {/* ACHIEVEMENT */}

          {score >= 4 && (

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

                <Award size={24} />

              </div>


              <div>

                <p className="font-bold text-orange-900">
                  Heritage Explorer Badge Unlocked
                </p>

                <p className="mt-1 text-sm text-orange-800">
                  You demonstrated strong knowledge of India's heritage.
                </p>

              </div>

            </div>

          )}

        </main>

      </div>

    );

  }


  // =========================
  // QUIZ SCREEN
  // =========================

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">


        {/* BACK */}

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
        >

          <ArrowLeft size={17} />

          Back to Explore

        </Link>


        {/* HEADER */}

        <div className="mt-7">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

              <Sparkles size={23} />

            </div>


            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                BHARAT ROOTS
              </p>

              <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
                Heritage Quiz
              </h1>

            </div>

          </div>


          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Test your knowledge of India's monuments,
            history and cultural heritage.
          </p>

        </div>


        {/* QUIZ CARD */}

        <section className="mt-8 overflow-hidden rounded-3xl bg-slate-900 shadow-xl">


          {/* TOP BAR */}

          <div className="border-b border-slate-700 px-6 py-5 md:px-8">

            <div className="flex items-center justify-between">

              <span className="text-sm font-semibold text-slate-400">
                Question {currentQuestion + 1} of{" "}
                {QUIZ_QUESTIONS.length}
              </span>


              <span className="text-sm font-bold text-orange-400">
                Score: {score}
              </span>

            </div>


            {/* PROGRESS */}

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>


          {/* QUESTION */}

          <div className="px-6 py-8 md:px-10 md:py-10">

            <p className="text-sm font-bold uppercase tracking-wider text-orange-400">
              QUESTION {currentQuestion + 1}
            </p>


            <h2 className="mt-3 text-2xl font-bold leading-9 text-white md:text-3xl">
              {question.question}
            </h2>


            {/* OPTIONS */}

            <div className="mt-8 space-y-3">

              {question.options.map(
                (option, index) => {

                  const isSelected =
                    selectedAnswer === option;

                  const isCorrect =
                    option === question.answer;


                  let optionClass =
                    "border-slate-700 bg-slate-800 text-slate-200 hover:border-orange-500 hover:bg-slate-750";


                  if (selectedAnswer) {

                    if (isCorrect) {

                      optionClass =
                        "border-emerald-500 bg-emerald-500/10 text-emerald-300";

                    } else if (isSelected) {

                      optionClass =
                        "border-red-500 bg-red-500/10 text-red-300";

                    } else {

                      optionClass =
                        "border-slate-800 bg-slate-900 text-slate-500";

                    }

                  }


                  return (

                    <button
                      key={option}
                      onClick={() =>
                        handleAnswer(option)
                      }
                      disabled={!!selectedAnswer}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${optionClass}`}
                    >

                      {/* OPTION LETTER */}

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                          selectedAnswer
                            ? isCorrect
                              ? "bg-emerald-500 text-white"
                              : isSelected
                              ? "bg-red-500 text-white"
                              : "bg-slate-800 text-slate-500"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >

                        {String.fromCharCode(
                          65 + index
                        )}

                      </span>


                      <span className="flex-1 font-medium">
                        {option}
                      </span>


                      {/* RESULT ICON */}

                      {selectedAnswer &&
                        isCorrect && (

                          <CheckCircle2
                            size={21}
                            className="shrink-0 text-emerald-400"
                          />

                        )}


                      {selectedAnswer &&
                        isSelected &&
                        !isCorrect && (

                          <XCircle
                            size={21}
                            className="shrink-0 text-red-400"
                          />

                        )}

                    </button>

                  );

                }
              )}

            </div>


            {/* FEEDBACK */}

            {selectedAnswer && (

              <div
                className={`mt-6 rounded-2xl p-5 ${
                  selectedAnswer ===
                  question.answer
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >

                <div className="flex gap-3">

                  {selectedAnswer ===
                  question.answer ? (
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={21}
                      className="mt-0.5 shrink-0"
                    />
                  )}


                  <div>

                    <p className="font-bold">

                      {selectedAnswer ===
                      question.answer
                        ? "Correct!"
                        : "Not quite!"}

                    </p>


                    <p className="mt-1 text-sm leading-6 opacity-90">

                      The correct answer is{" "}
                      <strong>
                        {question.answer}
                      </strong>
                      .

                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* NEXT */}

            <div className="mt-8 flex justify-end">

              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {currentQuestion ===
                QUIZ_QUESTIONS.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}

                <ChevronRight size={18} />

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>

  );
}