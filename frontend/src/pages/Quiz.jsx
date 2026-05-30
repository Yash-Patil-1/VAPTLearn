import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import axios from 'axios'

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

  const loadQuestion = () => {
    setResult(null); setAnswer(''); setShowHint(false)
    axios.get(`/api/quiz/next?category=${category}`)
      .then(r => setQuestion(r.data))
      .catch(() => setQuestion(null))
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

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Quiz</h1>
      <p className="text-ash mb-6">Test your knowledge — type commands, solve scenarios, explain concepts.</p>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setParams({ category: cat })}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${cat === category ? 'bg-amber/20 text-amber border border-amber/50' : 'bg-white/5 text-ash hover:text-polar border border-white/10 hover:border-amber/30'}`}>
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-6 text-sm">
        <span className="text-ash">Answered: <span className="text-polar">{stats.total_answered}</span></span>
        <span className="text-ash">Correct: <span className="text-green">{stats.correct}</span></span>
        <span className="text-ash">Accuracy: <span className="text-amber">{stats.accuracy}%</span></span>
      </div>

      {question ? (
        <div className="card">
          <div className="flex justify-between mb-4">
            <span className="tag-amber">{question.type}</span>
            <span className="tag-green">{question.difficulty}</span>
          </div>

          <p className="text-polar mb-6 leading-relaxed text-lg">{question.question}</p>

          {!result && (
            <>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder={question.type === 'command' ? 'Type the command...' : 'Type your answer...'}
                className="input-field font-mono text-sm h-24 resize-none mb-4"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer() }}} />
              <div className="flex gap-3">
                <button onClick={submitAnswer} className="btn-primary">Submit</button>
                <button onClick={() => setShowHint(true)} className="btn-ghost flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />Hint
                </button>
              </div>
              {showHint && question.hints?.[0] && (
                <p className="mt-4 text-xs text-amber italic">💡 {question.hints[0]}</p>
              )}
            </>
          )}

          {result && (
            <div className={`mt-4 p-4 rounded-lg border ${result.correct ? 'border-green/50 bg-green/5' : 'border-[#E74C3C]/50 bg-[#E74C3C]/5'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct ? <CheckCircle className="w-5 h-5 text-green" /> : <XCircle className="w-5 h-5 text-[#E74C3C]" />}
                <span className="font-medium text-polar">{result.correct ? 'Correct!' : 'Incorrect'}</span>
              </div>
              <p className="text-sm text-slate mb-2">{result.explanation}</p>
              {!result.correct && <p className="text-xs text-ash">Expected: <code className="text-amber bg-white/5 px-2 py-0.5 rounded">{result.expected}</code></p>}
              <button onClick={loadQuestion} className="btn-primary mt-4">Next Question →</button>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-ash">No questions available for this category yet.</p>
          <p className="text-xs text-ash mt-2">Questions are being added — try another category.</p>
        </div>
      )}
    </div>
  )
}
