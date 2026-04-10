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

// фон: сердечки + котята
const BG_ITEMS = [
  "💕","🐱","💗","🐾","💖","🐱","💓","💕","🐾","💗",
  "🐱","💕","💖","🐾","💗","🐱","💕","💓","🐾","💖",
  "🐱","💕","💗","🐾","💖","🐱","💕","💓","💗","🐾",
];

interface FallingHeart {
  id: number; x: number; size: number;
  delay: number; duration: number;
  emoji: string; swayAmp: number;
}

interface Firework {
  id: number; x: number; y: number; color: string;
  particles: { angle: number; dist: number; emoji: string }[];
}

// ── 520 hearts rain ────────────────────────────────────────────────────────
function HeartsRain({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const emojis = ["💕","💗","💖","💓","🩷","❤️","💘","💝","🌸","✨","💞","💟"];

  useEffect(() => {
    if (!active) { setHearts([]); return; }
    setHearts(Array.from({ length: 520 }, (_, i) => ({
      id: i,
      x: Math.random() * 102 - 1,
      size: 8 + Math.random() * 24,
      delay: Math.random() * 1.6,
      duration: 1.0 + Math.random() * 1.8,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      swayAmp: 15 + Math.random() * 50,
    })));
  }, [active]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <span key={h.id} className="absolute top-0 select-none"
          style={{
            left: `${h.x}%`, fontSize: `${h.size}px`,
            animation: `rainFall ${h.duration}s ${h.delay}s ease-in forwards`,
            "--sway": `${h.swayAmp}px`,
          } as React.CSSProperties}
        >{h.emoji}</span>
      ))}
    </div>
  );
}

// ── Fireworks ──────────────────────────────────────────────────────────────
function Fireworks({ active }: { active: boolean }) {
  const [bursts, setBursts] = useState<Firework[]>([]);
  const colors = ["#f472b6","#fb7185","#e879f9","#a78bfa","#60a5fa","#34d399","#fbbf24","#f97316"];
  const partEmojis = ["✨","⭐","💫","🌟","💕","🌸","🎉","💖"];

  const spawnBurst = useCallback(() => {
    setBursts((prev) => [...prev.slice(-10), {
      id: Date.now() + Math.random(),
      x: 8 + Math.random() * 84,
      y: 5 + Math.random() * 65,
      color: colors[Math.floor(Math.random() * colors.length)],
      particles: Array.from({ length: 22 }, (_, i) => ({
        angle: (i / 22) * 360 + Math.random() * 8,
        dist: 55 + Math.random() * 90,
        emoji: partEmojis[Math.floor(Math.random() * partEmojis.length)],
      })),
    }]);
  }, []);

  useEffect(() => {
    if (!active) { setBursts([]); return; }
    spawnBurst();
    const interval = setInterval(spawnBurst, 420);
    return () => clearInterval(interval);
  }, [active, spawnBurst]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {bursts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          <div className="absolute w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: b.color, boxShadow: `0 0 24px 10px ${b.color}`, animation: "fwFlash 0.65s ease-out forwards" }}
          />
          {b.particles.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            return (
              <span key={i} className="absolute select-none"
                style={{
                  left: 0, top: 0, fontSize: "13px",
                  "--tx": `${Math.cos(rad) * p.dist}px`,
                  "--ty": `${Math.sin(rad) * p.dist}px`,
                  animation: `fwParticle 1.0s ${i * 0.018}s ease-out forwards`,
                } as React.CSSProperties}
              >{p.emoji}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Cloud shape wrapper ────────────────────────────────────────────────────
function CloudCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* cloud bumps top */}
      <div className="absolute -top-5 left-8 w-14 h-14 rounded-full bg-rose-50 border border-rose-200 z-10" />
      <div className="absolute -top-8 left-20 w-20 h-20 rounded-full bg-rose-50 border border-rose-200 z-10" />
      <div className="absolute -top-6 left-36 w-16 h-16 rounded-full bg-rose-50 border border-rose-200 z-10" />
      <div className="absolute -top-4 right-24 w-12 h-12 rounded-full bg-rose-50 border border-rose-200 z-10" />
      <div className="absolute -top-7 right-10 w-18 h-18 rounded-full bg-rose-50 border border-rose-200 z-10" />
      {/* main body */}
      <div
        className="relative z-20 rounded-3xl border border-rose-200 px-8 pt-10 pb-8"
        style={{
          background: "linear-gradient(160deg, #fff5f8 0%, #fef0f5 100%)",
          boxShadow: "0 8px 40px rgba(244,114,182,0.15), 0 2px 8px rgba(244,114,182,0.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
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

  const [bgItems] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      emoji: BG_ITEMS[i % BG_ITEMS.length],
      x: Math.random() * 94 + 2,
      y: Math.random() * 92 + 2,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 16 + Math.random() * 22,
      rot: Math.random() * 30 - 15,
    }))
  );

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  const triggerHearts = () => {
    setHeartsRain(true);
    setTimeout(() => setHeartsRain(false), 2800);
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
    setTimeout(() => {
      triggerHearts();
      setTimeout(() => {
        setTransitioning(true);
        setTimeout(() => {
          setShakeIdx(null); setCorrectIdx(null);
          setSelected(null); setConfirmed(false);
          if (currentQ + 1 >= questions.length) {
            setPhase("result");
            setTimeout(() => setFireworks(true), 300);
          } else {
            setCurrentQ((c) => c + 1);
          }
          setTransitioning(false);
        }, 420);
      }, 1000);
    }, 700);
  };

  const handleRestart = () => {
    setFireworks(false);
    setTransitioning(true);
    setTimeout(() => {
      setPhase("intro"); setCurrentQ(0); setScore(0);
      setSelected(null); setConfirmed(false); setTransitioning(false);
    }, 400);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12"
      style={{ background: "radial-gradient(ellipse at 30% 20%, #fce7f3 0%, #fff5f8 55%, #fdf0f5 100%)" }}
    >
      {/* фон: котята и сердечки */}
      {bgItems.map((p, i) => (
        <span key={i} className="absolute pointer-events-none select-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            fontSize: `${p.size}px`, opacity: 0.22,
            transform: `rotate(${p.rot}deg)`,
            animation: `bgFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        >{p.emoji}</span>
      ))}

      <HeartsRain active={heartsRain} />
      <Fireworks active={fireworks} />

      {/* card wrapper */}
      <div
        className="relative z-10 w-full max-w-lg"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(26px) scale(0.94)" : "translateY(0) scale(1)",
          transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)",
        }}
      >

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="text-center">
            <div className="inline-block text-6xl mb-6" style={{ animation: "heartPulse 1.5s ease-in-out infinite" }}>
              💌
            </div>
            <CloudCard>
              <p className="font-lora text-rose-300 text-xs mb-4 tracking-widest uppercase italic">
                A little quiz
              </p>
              <h1 className="font-garamond text-4xl text-rose-500 font-semibold mb-4 leading-tight" style={{ fontStyle: "italic" }}>
                For Princess Jasmine
              </h1>
              <p className="font-lora text-rose-400 text-lg leading-relaxed mb-2">
                My dear princess,
              </p>
              <p className="font-lora text-stone-500 text-base leading-relaxed mb-5">
                Do you remember all our special moments together? Let's find out how well you know our little story~
              </p>
              <p className="font-garamond text-rose-300 text-lg italic">9 questions await you ✨</p>

              <button
                onClick={handleStart}
                className="mt-7 font-lora text-lg px-10 py-3.5 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #f472b6 0%, #fb7185 100%)",
                  boxShadow: "0 8px 28px rgba(244,114,182,0.4)",
                }}
              >
                Open the letter 💗
              </button>
            </CloudCard>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === "quiz" && (
          <div>
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="font-lora text-rose-300 text-base italic">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="font-lora text-rose-400 text-base">
                ✨ {score} correct
              </span>
            </div>

            <div className="w-full rounded-full mb-8 overflow-hidden" style={{ height: 3, background: "#fce7f3" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f9a8d4, #fb7185)" }}
              />
            </div>

            <CloudCard>
              {/* номер вопроса */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-lora font-semibold shrink-0"
                  style={{ background: "linear-gradient(135deg, #f472b6, #fb7185)" }}
                >
                  {currentQ + 1}
                </span>
                <div className="flex-1 h-px bg-rose-100" />
              </div>

              <h2 className="font-garamond text-2xl text-rose-600 mb-7 font-semibold leading-snug" style={{ fontStyle: "italic" }}>
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
                      className="w-full text-left px-5 py-3 rounded-2xl border font-lora text-base transition-all duration-200"
                      style={{
                        borderColor: isGreen ? "#34d399" : isWrong ? "#fca5a5" : "#fce7f3",
                        background: isGreen ? "#f0fdf4" : isWrong ? "#fff1f2" : "rgba(255,255,255,0.7)",
                        color: isGreen ? "#059669" : isWrong ? "#f43f5e" : "#9d5b78",
                        transform: isGreen ? "scale(1.02)" : undefined,
                        animation: isShake ? "shake 0.42s ease" : undefined,
                        cursor: confirmed ? "default" : "pointer",
                        boxShadow: isGreen ? "0 0 0 2px #86efac" : isWrong ? "0 0 0 2px #fca5a5" : "none",
                      }}
                    >
                      <span className="mr-2 text-rose-300 text-sm">{["○", "○", "○", "○"][idx]}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-right">
                <span className="font-garamond text-rose-200 text-sm italic">with love, Yersin 🐾</span>
              </div>
            </CloudCard>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && (
          <div className="text-center">
            <div className="inline-block text-6xl mb-5" style={{ animation: "heartPulse 1.1s ease-in-out infinite" }}>
              💖
            </div>
            <h1 className="font-garamond text-5xl text-rose-400 font-semibold mb-1" style={{ fontStyle: "italic" }}>
              {score === questions.length ? "Perfect! 🌟" : score >= 6 ? "Amazing! 💕" : "So cute! 🌸"}
            </h1>
            <p className="font-lora text-rose-300 text-lg mb-8 italic">
              {score} out of {questions.length} correct answers
            </p>

            <CloudCard>
              <p className="font-garamond text-rose-300 text-xs italic mb-5 tracking-widest uppercase">
                A letter to the most beautiful princess
              </p>
              <p className="font-lora text-stone-600 text-base leading-relaxed">
                Dear and most beautiful Princess Jasmine in the world! 🌹<br /><br />
                Your little kitten wishes you to never feel sad or worried —
                everything will be absolutely fine! 🌸<br /><br />
                Remember that you are the most unique girl on this planet,
                and you will definitely achieve all of your dreams and goals! ✨
              </p>
              <div className="mt-7 pt-4 border-t border-rose-100 text-right">
                <p className="font-lora text-rose-300 italic text-sm">with all the love,</p>
                <p className="font-garamond text-rose-500 text-2xl mt-1 italic font-semibold">your kitten — Yersin 🐾</p>
              </div>
            </CloudCard>

            <button
              onClick={handleRestart}
              className="mt-8 font-lora text-base px-10 py-3.5 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #f472b6 0%, #fb7185 100%)",
                boxShadow: "0 8px 28px rgba(244,114,182,0.38)",
              }}
            >
              Try again 🌷
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bgFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-16px) rotate(calc(var(--rot, 0deg) + 6deg)); }
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
          0%   { transform: translateY(0) translateX(0); opacity: 1; }
          50%  { transform: translateY(48vh) translateX(var(--sway)); opacity: 0.85; }
          100% { transform: translateY(108vh) translateX(0); opacity: 0; }
        }
        @keyframes fwFlash {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          60%  { transform: translate(-50%,-50%) scale(2); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
        }
        @keyframes fwParticle {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          80%  { opacity: 0.7; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
