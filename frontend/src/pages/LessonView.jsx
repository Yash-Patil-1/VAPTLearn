import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, Award, Flame } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function LessonView() {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState(0)
  // Checkpoint state: which checkpoint is next in the queue
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  const [checkpointIds, setCheckpointIds] = useState([])
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [streak, setStreak] = useState(null)
  const sectionRef = useRef(null)
  // 'reading' | 'checkpoint' | 'result'
  const [phase, setPhase] = useState('reading')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true); setError(false); setLesson(null)
    axios.get(`/api/lessons/${id}`).then(r => {
      setLesson(r.data)
      const ids = [...r.data.checkpoint_question_ids].sort(() => Math.random() - 0.5)
      setCheckpointIds(ids)
      setLoading(false)
    }).catch(() => { setError(true); setLoading(false) })
  }, [id])

  useEffect(() => {
    sectionRef.current?.focus()
  }, [step])

  // When entering checkpoint phase, fetch the question
  useEffect(() => {
    if (phase !== 'checkpoint' || !lesson) return
    if (checkpointIndex >= checkpointIds.length) {
      // No more checkpoints, go back to reading
      setPhase('reading')
      return
    }
    const qid = checkpointIds[checkpointIndex]
    setAnswer('')
    setResult(null)
    setShowHint(false)
    setQuestion(null)
    // Fetch question details without marking as seen in quiz_history
    axios.get(`/api/quiz/question/${qid}`)
      .then(r => setQuestion(r.data))
      .catch(() => {
        // Question fetch failed, skip this checkpoint
        setCheckpointIndex(i => i + 1)
      })
  }, [phase, checkpointIndex, checkpointIds, lesson])

  const submitCheckpoint = () => {
    if (!answer.trim() || !question) return
    axios.post('/api/quiz/answer', {
      question_id: question.id,
      category: question.category || '',
      answer,
    }).then(r => {
      setResult(r.data)
      if (r.data.xp_awarded > 0) {
        setXpEarned(prev => prev + r.data.xp_awarded)
      }
      if (r.data.streak) {
        setStreak(r.data.streak)
      }
      setPhase('result')
    })
  }

  const advanceAfterResult = () => {
    const nextIdx = checkpointIndex + 1
    setCheckpointIndex(nextIdx)
    setQuestion(null)
    setResult(null)
    setAnswer('')
    setShowHint(false)
    setPhase('reading')
    // Move to next section
    setStep(s => Math.min(s + 1, lesson.sections.length - 1))
  }

  const advanceSection = () => {
    const nextStep = step + 1
    if (nextStep >= lesson.sections.length) {
      completeLesson()
      return
    }
    // Check if a checkpoint should appear before the next section
    // Spread checkpoints evenly across sections
    const checkpointCadence = Math.max(1,
      Math.floor(lesson.sections.length / Math.max(1, checkpointIds.length))
    )
    const shouldCheckpoint = checkpointIndex < checkpointIds.length &&
      nextStep % checkpointCadence === 0

    if (shouldCheckpoint) {
      setPhase('checkpoint')
    } else {
      setStep(nextStep)
    }
  }

  const completeLesson = async () => {
    try {
      const r = await axios.post(`/api/lessons/${id}/complete`)
      setXpEarned(prev => prev + r.data.xp_awarded)
      setStreak(r.data.streak)
    } catch {}
    setCompleted(true)
  }

  if (completed) {
    return (
      <div className="max-w-4xl">
        <div className="p-10 text-center animate-fade-in"
          style={{
            backgroundColor: '#141614',
            border: '1px solid rgba(180, 255, 0, 0.3)',
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
          }}>
          <Award className="w-16 h-16 mx-auto mb-4 text-[#B4FF00]" />
          <h2 className="text-2xl font-bold text-ice-white mb-2">Lesson Complete!</h2>
          <p className="text-ash-steel mb-6">You've mastered this phase of VAPT methodology.</p>
          {xpEarned > 0 && (
            <div className="inline-flex flex-wrap items-center gap-3 px-5 py-3 mb-6"
              style={{
                backgroundColor: 'rgba(180, 255, 0, 0.08)',
                border: '1px solid rgba(180, 255, 0, 0.2)',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
              }}>
              <Flame className="w-5 h-5 text-[#B4FF00]" style={{ filter: 'drop-shadow(0 0 6px rgba(180,255,0,0.5))' }} />
              <span className="text-[#B4FF00] font-bold font-mono">+{xpEarned} XP</span>
              {streak && (
                <>
                  <span className="text-ash-steel font-mono text-sm">
                    Streak: {streak.current_streak} days
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5"
                    style={{
                      backgroundColor: 'rgba(180, 255, 0, 0.1)',
                      border: '1px solid rgba(180, 255, 0, 0.25)',
                      color: '#B4FF00',
                    }}>
                    LVL {streak.level}
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Link to="/learn" className="btn-primary">Next Lesson →</Link>
            <Link to="/quiz" className="btn-ghost">Practice Quiz</Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <Link to="/learn" className="inline-flex items-center gap-1 text-[#B4FF00] hover:underline mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to lessons
        </Link>
        <SkeletonLoader variant="text" lines={5} count={2} />
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="max-w-4xl">
        <Link to="/learn" className="inline-flex items-center gap-1 text-[#B4FF00] hover:underline mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to lessons
        </Link>
        <ErrorMessage message="Lesson not found or server unavailable." />
      </div>
    )
  }

  const sections = lesson.sections
  const totalSections = sections.length

  return (
    <div className="max-w-4xl">
      <Link to="/learn" className="inline-flex items-center gap-1 text-[#B4FF00] hover:underline mb-6 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to lessons
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5" style={{ backgroundColor: 'rgba(124, 131, 122, 0.15)' }}>
          <div className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${((step + 1) / totalSections) * 100}%`,
              backgroundColor: '#B4FF00',
              boxShadow: '0 0 8px rgba(180, 255, 0, 0.3)',
            }}
          />
        </div>
        <span className="text-xs font-mono text-ash-steel">{step + 1}/{totalSections}</span>
      </div>

      {/* ===== READING PHASE ===== */}
      {phase === 'reading' && (
        <>
          <div ref={sectionRef} tabIndex={-1} className="p-6 mb-6 animate-fade-in focus-visible:ring-1 focus-visible:ring-[#B4FF00] outline-none" key={`s-${step}`}
            style={{
              backgroundColor: '#141614',
              border: '1px solid rgba(180, 255, 0, 0.1)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono px-2 py-0.5"
                style={{ backgroundColor: 'rgba(180, 255, 0, 0.08)', color: '#B4FF00', border: '1px solid rgba(180, 255, 0, 0.2)' }}>
                Section {step + 1}
              </span>
            </div>
            <h2 className="text-xl font-bold text-ice-white mb-4">{sections[step].title}</h2>
            <div className="prose prose-invert max-w-none text-[#C9CFC7] leading-relaxed text-sm [&_strong]:text-ice-white [&_code]:text-[#B4FF00] [&_code]:bg-carbon-black [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:bg-carbon-black [&_pre]:border [&_pre]:border-forged-panel [&_pre]:p-3 [&_pre]:text-xs [&_pre]:font-mono">
              <ReactMarkdown>{sections[step].content}</ReactMarkdown>
            </div>

            {/* Key concepts */}
            {sections[step].key_concepts && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t"
                style={{ borderColor: 'rgba(124, 131, 122, 0.15)' }}>
                {sections[step].key_concepts.map((concept, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-mono"
                    style={{
                      backgroundColor: 'rgba(180, 255, 0, 0.04)',
                      border: '1px solid rgba(180, 255, 0, 0.1)',
                      color: '#7C837A',
                    }}>
                    {concept}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button onClick={advanceSection} className="btn-primary flex items-center gap-1">
              {step < totalSections - 1 ? (
                <>Next Section <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Complete Lesson <Award className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </>
      )}

      {/* ===== CHECKPOINT PHASE ===== */}
      {phase === 'checkpoint' && question && (
        <div className="p-6 mb-6 animate-fade-in"
          style={{
            backgroundColor: '#141614',
            border: '1px solid rgba(255, 92, 0, 0.15)',
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
          }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono px-2 py-0.5"
              style={{ backgroundColor: 'rgba(255, 92, 0, 0.1)', color: '#FF5C00', border: '1px solid rgba(255, 92, 0, 0.3)' }}>
              CHECKPOINT
            </span>
          </div>

          <p className="text-ice-white mb-5 leading-relaxed text-base">{question.question}</p>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full bg-carbon-black border p-3 text-ice-white font-mono text-sm resize-none h-24 mb-3 focus:outline-none transition-colors"
            style={{ borderColor: answer ? 'rgba(180, 255, 0, 0.3)' : 'rgba(124, 131, 122, 0.15)' }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitCheckpoint() }}}
          />
          <div className="flex gap-3">
            <button onClick={submitCheckpoint} className="btn-primary">Submit</button>
            <button onClick={() => setShowHint(true)} className="btn-ghost flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> Hint
            </button>
          </div>
          {showHint && question.hints?.[0] && (
            <p className="mt-3 text-xs italic" style={{ color: '#FF5C00' }}>💡 {question.hints[0]}</p>
          )}
        </div>
      )}

      {/* ===== RESULT PHASE ===== */}
      {phase === 'result' && result && (
        <div className="p-6 mb-6 animate-fade-in"
          style={{
            border: `1px solid ${result.correct ? 'rgba(180, 255, 0, 0.5)' : 'rgba(255, 59, 48, 0.5)'}`,
            backgroundColor: result.correct ? 'rgba(180, 255, 0, 0.04)' : 'rgba(255, 59, 48, 0.04)',
          }}>
          <div className="flex items-center gap-2 mb-3">
            {result.correct
              ? <CheckCircle className="w-5 h-5 text-[#B4FF00]" />
              : <XCircle className="w-5 h-5 text-critical" />
            }
            <span className="font-medium text-ice-white">
              {result.correct ? 'Correct!' : 'Not quite'}
            </span>
            {result.xp_awarded > 0 && (
              <span className="text-[#B4FF00] text-xs font-mono ml-auto">
                <Flame className="w-3 h-3 inline mr-1" />+{result.xp_awarded} XP
              </span>
            )}
          </div>
          <p className="text-sm text-[#C9CFC7] mb-3">{result.explanation}</p>
          {!result.correct && (
            <p className="text-xs text-ash-steel mb-3">
              Expected: <code className="text-[#B4FF00] bg-carbon-black px-1 py-0.5 text-xs">{result.expected}</code>
            </p>
          )}
          <button onClick={advanceAfterResult} className="btn-primary flex items-center gap-1">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
