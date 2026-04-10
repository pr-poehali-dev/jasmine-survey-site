import { useState, useEffect, useCallback } from "react";

const questions = [
  {
    id: 1,
    question: "How did we meet?",
    options: ["On a walk", "Through mutual friends", "On Instagram", "At a party"],
    correct: "On Instagram",
  },
  {
    id: 2,
    question: "What is the date we first connected?",
    options: ["01.11.2025", "12.11.2025", "20.12.2025", "05.10.2025"],
    correct: "12.11.2025",
  },
  {
    id: 3,
    question: "What was my very first compliment to you?",
    options: ["Sunshine girl", "Clean girl", "Dream girl", "Sweet girl"],
    correct: "Clean girl",
  },
  {
    id: 4,
    question: "Which book did we both read and discuss for the first time?",
    options: ["The Little Prince", "Norwegian Wood", "Flowers for Algernon", "The Alchemist"],
    correct: "Flowers for Algernon",
  },
  {
    id: 5,
    question: "What is the date of our very first meeting in person?",
    options: ["01.01.2026", "14.02.2026", "20.03.2026", "12.02.2026"],
    correct: "12.02.2026",
  },
  {
    id: 6,
    question: "Who is the best girl in the world?",
    options: ["Princess Aurora", "Princess Jasmine", "Princess Cinderella", "Princess Ariel"],
    correct: "Princess Jasmine",
  },
  {
    id: 7,
    question: "Who is the most beautiful girl in the world?",
    options: ["Princess Belle", "Princess Rapunzel", "Princess Jasmine", "Princess Elsa"],
    correct: "Princess Jasmine",
  },
  {
    id: 8,
    question: "Who is the coolest girl on the planet?",
    options: ["Princess Moana", "Princess Snow White", "Princess Merida", "Princess Jasmine"],
    correct: "Princess Jasmine",
  },
  {
    id: 9,
    question: "Who is my sweet little kitten? 🐾",
    options: ["Maybe me?", "Hmm, is it me?", "Yaaaaaay, me!", "Obviously me!"],
    correct: "Yaaaaaay, me!",
  },
];

// ── Types ──────────────────────────────────────────────────────────────────
interface FallingHeart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  emoji: string;
  swayAmp: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: { angle: number; dist: number; emoji: string }[];
}

// ── Falling hearts on transition ───────────────────────────────────────────
function HeartsRain({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const emojis = ["💕", "💗", "💖", "💓", "🩷", "❤️", "💘", "💝", "🌸", "✨"];

  useEffect(() => {
    if (!active) { setHearts([]); return; }
    const count = 120;
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 10 + Math.random() * 22,
        delay: Math.random() * 0.8,
        duration: 1.2 + Math.random() * 1.4,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        swayAmp: 20 + Math.random() * 40,
      }))
    );
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute top-0 select-none"
          style={{
            left: `${h.x}%`,
            fontSize: `${h.size}px`,
            animation: `rainFall ${h.duration}s ${h.delay}s ease-in forwards`,
            "--sway": `${h.swayAmp}px`,
          } as React.CSSProperties}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

// ── Fireworks ──────────────────────────────────────────────────────────────
function Fireworks({ active }: { active: boolean }) {
  const [bursts, setBursts] = useState<Firework[]>([]);
  const colors = ["#f472b6", "#fb7185", "#e879f9", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"];
  const partEmojis = ["✨", "⭐", "💫", "🌟", "💕", "🌸"];

  const spawnBurst = useCallback(() => {
    const newBurst: Firework = {
      id: Date.now() + Math.random(),
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      particles: Array.from({ length: 18 }, (_, i) => ({
        angle: (i / 18) * 360,
        dist: 60 + Math.random() * 80,
        emoji: partEmojis[Math.floor(Math.random() * partEmojis.length)],
      })),
    };
    setBursts((prev) => [...prev.slice(-8), newBurst]);
  }, []);

  useEffect(() => {
    if (!active) { setBursts([]); return; }
    spawnBurst();
    const interval = setInterval(spawnBurst, 500);
    return () => clearInterval(interval);
  }, [active, spawnBurst]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
        >
          {/* core flash */}
          <div
            className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              background: b.color,
              boxShadow: `0 0 20px 8px ${b.color}`,
              animation: "fwFlash 0.6s ease-out forwards",
            }}
          />
          {/* particles */}
          {b.particles.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.dist;
            const ty = Math.sin(rad) * p.dist;
            return (
              <span
                key={i}
                className="absolute text-sm select-none"
                style={{
                  left: 0, top: 0,
                  "--tx": `${tx}px`,
                  "--ty": `${ty}px`,
                  animation: `fwParticle 0.9s ${i * 0.02}s ease-out forwards`,
                } as React.CSSProperties}
              >
                {p.emoji}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Index() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [correctIdx, setCorrectIdx] = useState<number | null>(null);
  const [heartsRain, setHeartsRain] = useState(false);
  const [fireworks, setFireworks] = useState(false);

  // bg ambient particles
  const [ambient] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      emoji: ["💕","🌸","💗","✨","💖","🌷","🫧","💓","⭐"][i % 9],
      x: Math.random() * 92 + 2,
      y: Math.random() * 88 + 2,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
      size: 13 + Math.random() * 14,
    }))
  );

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  const triggerHearts = () => {
    setHeartsRain(true);
    setTimeout(() => setHeartsRain(false), 2200);
  };

  const handleStart = () => {
    setTransitioning(true);
    setTimeout(() => { setPhase("quiz"); setTransitioning(false); }, 400);
  };

  const handleSelect = (option: string, idx: number) => {
    if (confirmed || transitioning) return;
    setSelected(option);
    setConfirmed(true);
    const isCorrect = option === q.correct;

    if (isCorrect) {
      setCorrectIdx(idx);
      setScore((s) => s + 1);
    } else {
      setShakeIdx(idx);
      setTimeout(() => setCorrectIdx(q.options.indexOf(q.correct)), 380);
    }

    // wait → show hearts rain → transition
    setTimeout(() => {
      triggerHearts();
      setTimeout(() => {
        setTransitioning(true);
        setTimeout(() => {
          setShakeIdx(null);
          setCorrectIdx(null);
          setSelected(null);
          setConfirmed(false);
          if (currentQ + 1 >= questions.length) {
            setPhase("result");
            setTimeout(() => setFireworks(true), 300);
          } else {
            setCurrentQ((c) => c + 1);
          }
          setTransitioning(false);
        }, 420);
      }, 900);
    }, 700);
  };

  const handleRestart = () => {
    setFireworks(false);
    setTransitioning(true);
    setTimeout(() => {
      setPhase("intro");
      setCurrentQ(0);
      setScore(0);
      setSelected(null);
      setConfirmed(false);
      setTransitioning(false);
    }, 400);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10"
      style={{ background: "radial-gradient(ellipse at 25% 15%, #fce7f3 0%, #fff0f6 45%, #fdf4f8 100%)" }}
    >
      {/* Ambient particles */}
      {ambient.map((p, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            fontSize: `${p.size}px`, opacity: 0.16,
            animation: `ambientFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        >{p.emoji}</span>
      ))}

      {/* Hearts rain layer */}
      <HeartsRain active={heartsRain} />

      {/* Fireworks layer */}
      <Fireworks active={fireworks} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(24px) scale(0.95)" : "translateY(0) scale(1)",
          transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)",
        }}
      >

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="text-center">
            <div className="inline-block text-7xl mb-5" style={{ animation: "heartPulse 1.5s ease-in-out infinite" }}>
              💕
            </div>
            <h1 className="font-playfair text-5xl text-rose-400 font-semibold tracking-wide mb-2" style={{ fontStyle: "italic" }}>
              Our Story
            </h1>
            <p className="font-dancing text-rose-300 text-2xl mb-1">a little quiz for a princess</p>
            <p className="font-dancing text-rose-200 text-xl mb-10">9 questions about us ✨</p>

            <div
              className="bg-white/60 backdrop-blur-md rounded-3xl p-8 mb-8 text-left border border-rose-100"
              style={{ boxShadow: "0 8px 48px rgba(244,114,182,0.12)" }}
            >
              <p className="font-dancing text-rose-500 text-xl leading-relaxed">
                Hey Princess Jasmine 🌸<br />
                Do you remember all our special moments?<br />
                Let's see how well you know our story~
              </p>
            </div>

            <button
              onClick={handleStart}
              className="font-dancing text-2xl px-12 py-4 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #f472b6 0%, #fb7185 100%)",
                boxShadow: "0 8px 32px rgba(244,114,182,0.45)",
              }}
            >
              Start the quiz 💗
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === "quiz" && (
          <div>
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="font-dancing text-rose-300 text-xl">
                Question {currentQ + 1} / {questions.length}
              </span>
              <span className="font-dancing text-rose-400 text-xl">
                ✨ {score} correct
              </span>
            </div>

            <div className="w-full rounded-full mb-7 overflow-hidden" style={{ height: 3, background: "#fce7f3" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f9a8d4, #fb7185)" }}
              />
            </div>

            <div
              className="bg-white/65 backdrop-blur-md rounded-3xl p-8 border border-rose-100"
              style={{ boxShadow: "0 12px 56px rgba(244,114,182,0.13)" }}
            >
              <h2 className="font-playfair text-2xl text-rose-500 text-center mb-8 font-medium leading-snug" style={{ fontStyle: "italic" }}>
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const isShake = shakeIdx === idx;
                  const isGreen = correctIdx === idx;
                  const isWrong = confirmed && selected === opt && !isGreen;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(opt, idx)}
                      disabled={confirmed}
                      className="w-full text-left px-5 py-3.5 rounded-2xl border-2 font-dancing text-lg transition-all duration-200"
                      style={{
                        borderColor: isGreen ? "#34d399" : isWrong ? "#fca5a5" : "#fce7f3",
                        background: isGreen ? "#f0fdf4" : isWrong ? "#fff1f2" : "rgba(255,255,255,0.7)",
                        color: isGreen ? "#059669" : isWrong ? "#f43f5e" : "#f472b6",
                        transform: isGreen ? "scale(1.02)" : undefined,
                        animation: isShake ? "shake 0.42s ease" : undefined,
                        cursor: confirmed ? "default" : "pointer",
                      }}
                    >
                      <span className="mr-2 opacity-70">{["🌸", "💗", "🌷", "✨"][idx]}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && (
          <div className="text-center">
            <div className="inline-block text-7xl mb-5" style={{ animation: "heartPulse 1.1s ease-in-out infinite" }}>
              💖
            </div>
            <h1 className="font-playfair text-5xl text-rose-400 font-semibold mb-1" style={{ fontStyle: "italic" }}>
              {score === questions.length ? "Perfect! 🌟" : score >= 6 ? "Amazing! 💕" : "So cute! 🌸"}
            </h1>
            <p className="font-dancing text-rose-300 text-2xl mb-8">
              {score} out of {questions.length} correct answers
            </p>

            <div
              className="bg-white/65 backdrop-blur-md rounded-3xl p-8 mb-8 border border-rose-100 text-left"
              style={{ boxShadow: "0 12px 56px rgba(244,114,182,0.13)" }}
            >
              <p className="font-playfair text-rose-300 text-xs italic mb-5 tracking-widest uppercase">
                A letter to the most beautiful princess
              </p>
              <p className="font-dancing text-rose-600 text-[1.25rem] leading-relaxed">
                Dear and most beautiful Princess Jasmine in the world! 🌹<br /><br />
                Your little kitten wishes you to never feel sad or worried —<br />
                everything will be absolutely fine! 🌸<br /><br />
                Remember that you are the most unique girl on this planet,
                and you will definitely achieve all of your dreams and goals! ✨
              </p>
              <div className="mt-7 pt-5 border-t border-rose-100 text-right">
                <p className="font-playfair text-rose-300 italic text-base">with all the love,</p>
                <p className="font-dancing text-rose-500 text-2xl mt-1">your kitten — Yersin 🐾</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="font-dancing text-xl px-10 py-4 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #f472b6 0%, #fb7185 100%)",
                boxShadow: "0 8px 30px rgba(244,114,182,0.4)",
              }}
            >
              Try again 🌷
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ambientFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(10deg); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.28); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-9px); }
          40% { transform: translateX(9px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes rainFall {
          0% {
            transform: translateY(-30px) translateX(0px);
            opacity: 1;
          }
          50% {
            transform: translateY(45vh) translateX(var(--sway));
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) translateX(0px);
            opacity: 0;
          }
        }
        @keyframes fwFlash {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          60% { transform: translate(-50%,-50%) scale(1.8); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
        }
        @keyframes fwParticle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
