import { useEffect, useState } from 'react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function MitreView() {
  const [tactics, setTactics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadTactics = () => {
    setLoading(true); setError(false)
    axios.get('/api/mitre/tactics')
      .then(r => { setTactics(r.data.tactics); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { loadTactics() }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-ice-white mb-2">MITRE ATT&CK</h1>
      <p className="text-ash-steel mb-8">Techniques mapped to real penetration testing commands.</p>

      {error ? (
        <ErrorMessage onRetry={loadTactics} />
      ) : loading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : (
      <div className="space-y-4">
        {tactics.map(tactic => (
          <div key={tactic.id} className="p-5"
            style={{
              backgroundColor: 'var(--color-forged-panel)',
              border: '1px solid color-mix(in srgb, var(--color-ash-steel) 12%, transparent)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}>
            <h2 className="text-[var(--color-venom-green)] font-medium mb-3 font-mono text-sm">
              {tactic.id} — {tactic.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tactic.techniques.map(tech => (
                <div key={tech.id} className="flex items-center gap-2 p-2"
                  style={{
                    backgroundColor: 'var(--color-carbon-black)',
                    border: '1px solid color-mix(in srgb, var(--color-ash-steel) 10%, transparent)',
                  }}>
                  <span className="text-[var(--color-venom-green)] font-mono text-xs">{tech.id}</span>
                  <span className="text-xs text-[var(--color-slate-mist)] truncate">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
