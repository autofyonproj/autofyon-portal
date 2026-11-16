'use client';

import { useState } from 'react';
import type { SlideQuiz } from '@/lib/minisite';

export default function SlideQuizWidget({
  quiz,
  isAr,
}: {
  quiz: SlideQuiz;
  isAr: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = (isAr ? quiz.question_ar : quiz.question) || quiz.question;
  const options = (isAr && quiz.options_ar?.length) ? quiz.options_ar : quiz.options;
  const explanation = (isAr ? quiz.explanation_ar : quiz.explanation) || quiz.explanation;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
  };

  const isCorrect = selected === quiz.correctIndex;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 max-w-md shadow-2xl text-start select-none">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#c4a265] text-black">
          {isAr ? 'سؤال تفاعلي 💡' : 'Quick Quiz 💡'}
        </span>
      </div>
      <p className="text-white text-sm font-bold mb-3 leading-snug">
        {question}
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          let btnStyle = 'bg-white/10 hover:bg-white/20 text-white border-white/10';
          if (answered) {
            if (i === quiz.correctIndex) {
              btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold';
            } else if (i === selected) {
              btnStyle = 'bg-rose-600 text-white border-rose-400';
            } else {
              btnStyle = 'bg-white/5 text-white/40 border-white/5';
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`text-xs px-3 py-2 rounded-xl border text-start transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {answered && i === quiz.correctIndex && <span>✓</span>}
              {answered && i === selected && i !== quiz.correctIndex && <span>✗</span>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-3 text-xs p-2.5 rounded-xl border ${
          isCorrect ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          <div className="font-bold mb-0.5">
            {isCorrect ? (isAr ? '🎉 إجابة صحيحة وممتازة!' : '🎉 Correct Answer!') : (isAr ? 'الإجابة الصحيحة:' : 'Correct Answer:')}
          </div>
          {explanation && <p className="opacity-90">{explanation}</p>}
        </div>
      )}
    </div>
  );
}
