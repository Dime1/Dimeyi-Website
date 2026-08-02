'use client'
import { useState }                          from 'react'
import { AvatarPicker, type Avatar }         from './AvatarPicker'
import { QuizQuestion }                      from './QuizQuestion'
import { Leaderboard }                       from './Leaderboard'
import { QUIZ_QUESTIONS }                    from '@/config/content'

type Phase = 'setup' | 'playing' | 'done'

export function QuizModule() {
  const [phase,        setPhase]        = useState<Phase>('setup')
  const [name,         setName]         = useState('')
  const [avatar,       setAvatar]       = useState<Avatar | null>(null)
  const [questionIdx,  setQuestionIdx]  = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalTimeMs,  setTotalTimeMs]  = useState(0)
  const [finalScore,   setFinalScore]   = useState<{ correct: number; total: number } | null>(null)
  const [submitError,  setSubmitError]  = useState<string | null>(null)
  const [submitting,   setSubmitting]   = useState(false)

  const questions = [...QUIZ_QUESTIONS]

  async function handleAnswer(correct: boolean, timeTakenMs: number) {
    const newCorrect = correctCount + (correct ? 1 : 0)
    const newTime    = totalTimeMs + timeTakenMs

    if (questionIdx + 1 >= questions.length) {
      setFinalScore({ correct: newCorrect, total: questions.length })
      setSubmitting(true)
      await submitScore(newCorrect, newTime)
      setSubmitting(false)
      setPhase('done')
    } else {
      setCorrectCount(newCorrect)
      setTotalTimeMs(newTime)
      setQuestionIdx(i => i + 1)
    }
  }

  async function submitScore(score: number, time_taken_ms: number) {
    try {
      const res = await fetch('/api/quiz', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ player_name: name, avatar: avatar!, score, time_taken_ms }),
      })
      if (!res.ok) setSubmitError('Score could not be saved.')
    } catch {
      setSubmitError('Score could not be saved.')
    }
  }

  if (phase === 'setup') {
    return (
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <label className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/80 block mb-2 text-center">
            Your Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gold/20 rounded-sm px-4 py-3 font-sans text-sm text-plum bg-transparent focus:outline-none focus:border-gold/50 text-center"
          />
        </div>
        <div>
          <p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/80 text-center mb-4">
            Pick Your Avatar
          </p>
          <AvatarPicker selected={avatar} onSelect={setAvatar} />
        </div>
        <button
          type="button"
          disabled={!name.trim() || !avatar}
          onClick={() => setPhase('playing')}
          className="w-full border border-gold/30 text-plum font-sans text-sm font-medium tracking-[0.18em] uppercase py-3 hover:bg-plum hover:text-ivory transition-colors duration-300 disabled:opacity-40"
        >
          Begin the Quiz
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    return (
      <QuizQuestion
        key={questionIdx}
        question={questions[questionIdx]}
        questionNum={questionIdx + 1}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    )
  }

  if (submitting) {
    return (
      <p className="font-sans text-sm font-medium text-plum/75 text-center tracking-widest uppercase py-16">
        Saving your score…
      </p>
    )
  }

  return (
    <div className="space-y-16">
      <div className="text-center">
        <p className="font-script italic text-gold/90 text-3xl mb-2">
          {finalScore!.correct} / {finalScore!.total}
        </p>
        <p className="font-sans text-sm font-medium text-plum/75 tracking-widest uppercase">
          {finalScore!.correct === finalScore!.total ? 'Perfect score!' : 'Well played!'}
        </p>
        {submitError && (
          <p className="font-sans text-xs text-red-500 mt-4">{submitError}</p>
        )}
      </div>
      <Leaderboard />
    </div>
  )
}
