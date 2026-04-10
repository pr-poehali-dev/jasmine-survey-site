import { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    question: "Как мы познакомились?",
    options: [
      "Случайная встреча",
      "Через общих друзей",
      "В интернете",
      "На работе / учёбе",
    ],
  },
  {
    id: 2,
    question: "Какой наш первый совместный поход?",
    options: [
      "В кино",
      "В кафе или ресторан",
      "На прогулку в парк",
      "На концерт или мероприятие",
    ],
  },
  {
    id: 3,
    question: "Что тебе нравится больше всего в наших встречах?",
    options: [
      "Уютные вечера дома",
      "Приключения и путешествия",
      "Долгие разговоры",
      "Просто быть рядом",
    ],
  },
  {
    id: 4,
    question: "Наш любимый совместный ритуал?",
    options: [
      "Утренний кофе вместе",
      "Смотреть сериалы под плед",
      "Совместные прогулки",
      "Готовить что-то вкусное",
    ],
  },
  {
    id: 5,
    question: "Какой момент запомнился тебе больше всего?",
    options: [
      "Наш первый день вместе",
      "Спонтанная поездка",
      "Когда мы смеялись до слёз",
      "Тихий вечер, когда всё было идеально",
    ],
  },
];

const floatingHearts = ["💕", "🌸", "💗", "✨", "💖", "🌷", "💓", "🫧"];

function FloatingHeart({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none select-none text-2xl opacity-20 animate-float"
      style={style}
    >
      {emoji}
    </div>
  );
}

export default function Index() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const [hearts, setHearts] = useState<{ emoji: string; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, (_, i) => ({
      emoji: floatingHearts[i % floatingHearts.length],
      style: {
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 80 + 5}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
        fontSize: `${16 + Math.random() * 20}px`,
      } as React.CSSProperties,
    }));
    setHearts(generated);
  }, []);

  const handleSelect = (option: string) => {
    if (animating) return;
    setSelected(option);
  };

  const handleNext = () => {
    if (!selected || animating) return;
    setAnimating(true);
    const newAnswers = [...answers, selected];

    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);

      if (currentQ + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrentQ(currentQ + 1);
      }
      setAnimating(false);
    }, 350);
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
    setAnimating(false);
  };

  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fff0f5 0%, #ffe4ef 40%, #fce7f3 100%)" }}>
      {hearts.map((h, i) => (
        <FloatingHeart key={i} emoji={h.emoji} style={h.style} />
      ))}

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        {!done ? (
          <div key={currentQ} className={animating ? "opacity-0 -translate-y-4 transition-all duration-300" : "animate-fade-up"}>
            <div className="text-center mb-10">
              <div className="text-5xl mb-3 animate-heart-beat inline-block">💕</div>
              <h1 className="font-cormorant text-3xl text-rose-400 font-light tracking-wide">
                Наши моменты
              </h1>
              <p className="font-caveat text-rose-300 text-lg mt-1">
                вопрос {currentQ + 1} из {questions.length}
              </p>
            </div>

            <div className="w-full bg-rose-100 rounded-full h-1 mb-8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f9a8d4, #fb7185)" }}
              />
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-[0_8px_40px_rgba(251,114,153,0.12)] border border-rose-100">
              <h2 className="font-cormorant text-2xl text-rose-500 text-center mb-8 leading-snug font-medium">
                {questions[currentQ].question}
              </h2>

              <div className="space-y-3">
                {questions[currentQ].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl border transition-all duration-200 font-caveat text-lg
                      ${selected === option
                        ? "border-rose-400 bg-rose-50 text-rose-600 shadow-[0_0_0_2px_rgba(251,114,153,0.3)]"
                        : "border-rose-100 bg-white/60 text-rose-400 hover:border-rose-300 hover:bg-rose-50/60"
                      }`}
                  >
                    <span className="mr-2">{["🌸", "💗", "🌷", "✨"][idx]}</span>
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!selected}
                className={`mt-8 w-full py-3.5 rounded-2xl font-caveat text-xl transition-all duration-200
                  ${selected
                    ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-[0_4px_20px_rgba(251,114,153,0.4)] hover:shadow-[0_6px_28px_rgba(251,114,153,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-rose-100 text-rose-300 cursor-not-allowed"
                  }`}
              >
                {currentQ + 1 === questions.length ? "Завершить 💕" : "Следующий вопрос →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up text-center">
            <div className="text-6xl mb-6 animate-heart-beat inline-block">💖</div>
            <h1 className="font-cormorant text-4xl text-rose-500 font-light tracking-wide mb-2">
              Спасибо, принцесса!
            </h1>
            <p className="font-caveat text-rose-400 text-xl mb-10">
              Ты прошла все вопросы о наших моментах
            </p>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-[0_8px_40px_rgba(251,114,153,0.12)] border border-rose-100 mb-6 text-left space-y-4">
              {questions.map((q, i) => (
                <div key={i}>
                  <p className="font-cormorant text-rose-400 text-sm italic">{q.question}</p>
                  <p className="font-caveat text-rose-600 text-lg">{answers[i]}</p>
                  {i < questions.length - 1 && <div className="border-b border-rose-100 mt-2" />}
                </div>
              ))}
            </div>

            <button
              onClick={handleRestart}
              className="px-8 py-3.5 rounded-2xl font-caveat text-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-[0_4px_20px_rgba(251,114,153,0.4)] hover:shadow-[0_6px_28px_rgba(251,114,153,0.5)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Пройти снова 🌸
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
