import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Lightbulb, Flame } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

const CATEGORIES = [
  'reconnaissance', 'enumeration', 'web_testing', 'exploitation',
  'privilege_escalation', 'post_exploitation', 'active_directory',
  'password_attacks', 'wireless', 'vulnerability_assessment'
]

export default function Quiz() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'reconnaissance'
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [stats, setStats] = useState({ total_answered: 0, correct: 0, accuracy: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadQuestion = () => {
    setLoading(true); setError(false); setResult(null); setAnswer(''); setShowHint(false)
    axios.get(`/api/quiz/next?category=${category}`)
      .then(r => { setQuestion(r.data); setLoading(false) })
      .catch(e => { setError(e.response?.data?.detail || 'Failed to load question'); setLoading(false) })
  }

  const loadStats = () => {
    axios.get(`/api/quiz/stats?category=${category}`)
      .then(r => setStats(r.data))
      .catch(() => {})
  }

  useEffect(() => { loadQuestion(); loadStats() }, [category])

  const submitAnswer = () => {
    if (!answer.trim() || !question) return
    axios.post('/api/quiz/answer', { question_id: question.id, category, answer })
      .then(r => { setResult(r.data); loadStats() })
  }

  const activeCatStyle = {
    backgroundColor: 'rgba(180, 255, 0, 0.08)',
    border: '1px solid rgba(180, 255, 0, 0.3)',
    color: '#B4FF00',
  }
  const inactiveCatStyle = {
    backgroundColor: 'transparent',
    border: '1px solid rgba(124, 131, 122, 0.15)',
    color: '#7C837A',
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-ice-white mb-2" style={{ fontFamily: '"Rajdhani", "Chakra Petch", sans-serif' }}>Quiz</h1>
      <p className="text-ash-steel mb-6">Test your knowledge — type commands, solve scenarios, explain concepts.</p>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setParams({ category: cat })}
            className="px-3 py-1.5 text-xs font-mono transition-all duration-200"
            style={cat === category ? activeCatStyle : inactiveCatStyle}>
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-6 text-sm font-mono">
        <span className="text-ash-steel">Answered: <span className="text-ice-white">{stats.total_answered}</span></span>
        <span className="text-ash-steel">Correct: <span className="text-[#B4FF00]">{stats.correct}</span></span>
        <span className="text-ash-steel">Accuracy: <span className="text-medium">{stats.accuracy}%</span></span>
      </div>

      {loading ? (
        <div className="p-5" style={{
          backgroundColor: '#141614',
          border: '1px solid rgba(124, 131, 122, 0.12)',
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        }}>
          <SkeletonLoader variant="text" lines={6} />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadQuestion} />
      ) : question ? (
        <div className="p-5" style={{
          backgroundColor: '#141614',
          border: '1px solid rgba(124, 131, 122, 0.12)',
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        }}>
          <div className="flex justify-between mb-4">
            <span className="px-2 py-0.5 text-[10px] font-mono"
              style={{ border: '1px solid rgba(180, 255, 0, 0.2)', color: '#B4FF00' }}>
              {question.type}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono"
              style={{ border: '1px solid rgba(255, 196, 0, 0.3)', color: '#FFC400' }}>
              {question.difficulty}
            </span>
          </div>

          <p className="text-ice-white mb-6 leading-relaxed text-lg">{question.question}</p>

          {!result && (
            <>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder={question.type === 'command' ? 'Type the command...' : 'Type your answer...'}
                className="w-full bg-carbon-black border border-[rgba(124,131,122,0.15)] p-3 text-ice-white font-mono text-sm h-24 resize-none mb-4 focus:outline-none transition-colors"
                style={{ borderColor: answer ? 'rgba(180, 255, 0, 0.3)' : 'rgba(124, 131, 122, 0.15)' }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer() }}} />
              <div className="flex gap-3">
                <button onClick={submitAnswer} className="btn-primary">Submit</button>
                <button onClick={() => setShowHint(true)} className="btn-ghost flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />Hint
                </button>
              </div>
              {showHint && question.hints?.[0] && (
                <p className="mt-4 text-xs text-high italic">💡 {question.hints[0]}</p>
              )}
            </>
          )}

          {result && (
            <div className="mt-4 p-4"
              style={{
                border: `1px solid ${result.correct ? 'rgba(180, 255, 0, 0.5)' : 'rgba(255, 59, 48, 0.5)'}`,
                backgroundColor: result.correct ? 'rgba(180, 255, 0, 0.04)' : 'rgba(255, 59, 48, 0.04)',
              }}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct
                  ? <CheckCircle className="w-5 h-5 text-[#B4FF00]" />
                  : <XCircle className="w-5 h-5 text-critical" />
                }
                <span className="font-medium text-ice-white">
                  {result.correct ? 'Correct!' : 'Incorrect'}
                </span>
                {result.xp_awarded > 0 && (
                  <span className="flex items-center gap-1 text-xs text-[#B4FF00] font-mono ml-auto">
                    <Flame className="w-3 h-3" /> +{result.xp_awarded} XP
                  </span>
                )}
              </div>
              <p className="text-sm text-[#C9CFC7] mb-2">{result.explanation}</p>
              {!result.correct && (
                <p className="text-xs text-ash-steel">
                  Expected: <code className="text-[#B4FF00] bg-carbon-black px-1 py-0.5 text-xs">{result.expected}</code>
                </p>
              )}
              <button onClick={loadQuestion} className="btn-primary mt-4">Next Question →</button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 text-center" style={{
          backgroundColor: '#141614',
          border: '1px solid rgba(124, 131, 122, 0.12)',
        }}>
          <p className="text-ash-steel">No questions available for this category yet.</p>
          <p className="text-xs text-ash-steel mt-2">Questions are being added — try another category.</p>
        </div>
      )}
    </div>
  )
}
