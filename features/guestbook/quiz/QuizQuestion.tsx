'use client'
import { useEffect, useState } from 'react'
import type { QUIZ_QUESTIONS } from '@/config/content'

type Question = typeof QUIZ_QUESTIONS[number]

interface QuizQuestionProps {
  question:    Question
  questionNum: number
  total:       number
  onAnswer:    (correct: boolean, timeTakenMs: number) => void
}

const QUESTION_TIME_MS = 10_000

export function QuizQuestion({ question, questionNum, total, onAnswer }: QuizQuestionProps) {
  const [selected,  setSelected]  = useState<number | null>(null)
  const [startTime]               = useState(() => Date.now())
  const [remaining, setRemaining] = useState(QUESTION_TIME_MS)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 200
        if (next <= 0) {
          clearInterval(interval)
          onAnswer(false, QUESTION_TIME_MS)
          return 0
        }
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [onAnswer])

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    const timeTaken = Date.now() - startTime
    setTimeout(() => onAnswer(idx === question.answer, timeTaken), 600)
  }

  const progressPct = (remaining / QUESTION_TIME_MS) * 100

  return (
    <div className="max-w-md mx-auto">
      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30 text-center mb-6">
        Question {questionNum} of {total}
      </p>

      <div className="w-full bg-blush rounded-full h-1 mb-8">
        <div
          className="bg-gold h-1 rounded-full transition-all duration-200"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(remaining / 1000)}
          aria-valuemax={QUESTION_TIME_MS / 1000}
          aria-label="Time remaining"
        />
      </div>

      <p className="font-display text-xl text-plum text-center mb-8">
        {question.question}
      </p>

      <div className="space-y-3">
        {[...question.options].map((option, idx) => {
          let cls = 'border-gold/20 text-plum hover:border-gold/50'
          if (selected !== null) {
            if (idx === question.answer) cls = 'border-green-400 text-green-700 bg-green-50'
            else if (idx === selected)   cls = 'border-red-300  text-red-600   bg-red-50'
            else                         cls = 'border-gold/10  text-plum/30'
          }
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 border rounded-sm font-sans text-sm transition-all duration-300 disabled:cursor-default ${cls}`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
