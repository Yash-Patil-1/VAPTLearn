import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

// Phase name to slug mapping (single source of truth shared with backend)
const PHASE_SLUGS = [
  'reconnaissance', 'enumeration', 'vulnerability',
  'exploitation', 'privesc', 'postexploit', 'reporting',
]

export default function Phases() {
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadPhases = () => {
    setLoading(true); setError(false)
    axios.get('/api/phases/')
      .then(r => { setPhases(r.data.phases); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { loadPhases() }, [])

  const getPhaseSlug = (id) => PHASE_SLUGS[id - 1] || `phase${id}`

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-ice-white mb-2">Learning Paths</h1>
      <p className="text-ash-steel mb-8">Follow the PTES methodology phase by phase.</p>

      {/* Hex kill-chain strip */}
      {phases.length > 0 && (
        <div className="flex gap-0 mb-8 overflow-x-auto pb-2">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex items-center">
              <div className="flex flex-col items-center px-2"
                style={{
                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  backgroundColor: 'rgba(180, 255, 0, 0.06)',
                  border: '1px solid rgba(180, 255, 0, 0.15)',
                  width: '70px',
                  height: '60px',
                  justifyContent: 'center',
                }}>
                <span className="text-[#B4FF00] font-bold text-sm font-mono">{phase.id}</span>
              </div>
              {i < phases.length - 1 && (
                <div className="w-3 h-0.5" style={{ backgroundColor: 'rgba(180, 255, 0, 0.15)' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {error ? (
        <ErrorMessage onRetry={loadPhases} />
      ) : loading ? (
        <SkeletonLoader variant="list" count={7} />
      ) : (
        <div className="space-y-3">
          {phases.map((phase) => (
            <Link
              key={phase.id}
              to={`/learn/phase${phase.id}_${getPhaseSlug(phase.id)}`}
              className="block px-5 py-4 transition-all duration-200"
              style={{
                backgroundColor: '#141614',
                border: '1px solid rgba(124, 131, 122, 0.12)',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180, 255, 0, 0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124, 131, 122, 0.12)' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center shrink-0"
                  style={{
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    backgroundColor: 'rgba(180, 255, 0, 0.08)',
                    width: '32px', height: '28px',
                  }}>
                  <span className="text-[#B4FF00] font-bold text-xs font-mono">{phase.id}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-ice-white font-medium">{phase.name}</h3>
                  <p className="text-xs text-ash-steel mt-1">{phase.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono"
                      style={{ border: '1px solid rgba(180, 255, 0, 0.2)', color: '#B4FF00' }}>
                      {phase.command_count} commands
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-ash-steel"
                      style={{ border: '1px solid rgba(124, 131, 122, 0.2)' }}>
                      {phase.methodology}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
