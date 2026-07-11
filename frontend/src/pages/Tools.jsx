import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function Tools() {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadTools = () => {
    setLoading(true); setError(false)
    axios.get('/api/tools/')
      .then(r => { setTools(r.data.tools); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { loadTools() }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-ice-white mb-2">Tool Library</h1>
      <p className="text-ash-steel mb-8 font-mono">{tools.length} tools documented with usage examples.</p>

      {error ? (
        <ErrorMessage onRetry={loadTools} />
      ) : loading ? (
        <SkeletonLoader variant="list" count={8} className="grid grid-cols-1 md:grid-cols-2 gap-3" />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map(tool => (
          <div key={tool.id}
            className="p-4 transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-forged-panel)',
              border: '1px solid color-mix(in srgb, var(--color-ash-steel) 12%, transparent)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-venom-green) 30%, transparent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-ash-steel) 12%, transparent)' }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-ice-white font-medium">{tool.name}</h3>
                <p className="text-xs text-ash-steel mt-1 line-clamp-2">{tool.description}</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono shrink-0 ml-2"
                style={{ border: '1px solid color-mix(in srgb, var(--color-venom-green) 20%, transparent)', color: 'var(--color-venom-green)' }}>
                {tool.command_count}
              </span>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] font-mono"
                style={{ border: '1px solid color-mix(in srgb, var(--color-ash-steel) 20%, transparent)', color: 'var(--color-ash-steel)' }}>
                {tool.category.replace(/_/g, ' ')}
              </span>
              {tool.platforms?.slice(0, 2).map(p => (
                <span key={p} className="px-2 py-0.5 text-[10px] font-mono"
                  style={{ border: '1px solid color-mix(in srgb, var(--color-ash-steel) 20%, transparent)', color: 'var(--color-ash-steel)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
