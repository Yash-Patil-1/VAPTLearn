import { useState, useEffect } from 'react'
import { Search, BookText, ChevronDown, ChevronUp } from 'lucide-react'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function Glossary() {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/glossary')
      .then(r => r.json())
      .then(data => {
        setTerms(data.terms || [])
        setLoading(false)
      })
      .catch(e => {
        setError(e.message || 'Failed to load glossary')
        setLoading(false)
      })
  }, [])

  const filtered = search.trim()
    ? terms.filter(t =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : terms

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: '"Rajdhani", "Chakra Petch", sans-serif' }}>
            Glossary
          </h1>
        </div>
        <SkeletonLoader variant="text" count={12} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: '"Rajdhani", "Chakra Petch", sans-serif' }}>
          Glossary
        </h1>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: '"Rajdhani", "Chakra Petch", sans-serif', color: '#EAEEE8' }}>
            Glossary
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7C837A' }}>
            {terms.length} VAPT terminology definitions
          </p>
        </div>
        <BookText className="w-6 h-6" style={{ color: '#B4FF00' }} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7C837A' }} />
        <input
          type="text"
          placeholder="Search terms or definitions..."
          value={search}
          onChange={e => { setSearch(e.target.value); setExpanded(null) }}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-sm outline-none transition-colors"
          style={{
            backgroundColor: 'rgba(124, 131, 122, 0.06)',
            border: '1px solid rgba(124, 131, 122, 0.15)',
            color: '#EAEEE8',
          }}
        />
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs" style={{ color: '#7C837A' }}>
          {filtered.length} of {terms.length} terms match
        </p>
      )}

      {/* Term list */}
      <div className="space-y-1.5">
        {filtered.map((entry, i) => {
          const isOpen = expanded === i
          // Highlight search match in term
          const termDisplay = search
            ? highlightMatch(entry.term, search)
            : entry.term

          return (
            <div
              key={i}
              className="rounded-sm overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: isOpen ? 'rgba(124, 131, 122, 0.08)' : 'rgba(124, 131, 122, 0.04)',
                border: '1px solid rgba(124, 131, 122, 0.1)',
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[rgba(124,131,122,0.06)]"
              >
                <span className="text-sm font-medium" style={{ color: '#EAEEE8' }}>
                  {termDisplay}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" style={{ color: '#B4FF00' }} />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: '#7C837A' }} />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pt-0">
                  <p className="text-sm leading-relaxed" style={{ color: '#B0B5AE' }}>
                    {entry.definition}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#7C837A' }}>
            {search ? `No terms match "${search}"` : 'No terms found'}
          </p>
        </div>
      )}

      {/* Footer note */}
      <p className="text-[10px] text-center pt-4" style={{ color: '#7C837A', opacity: 0.6 }}>
        {terms.length} terms — continuously expanded as the platform grows
      </p>
    </div>
  )
}

/** Highlight search matches inside a string. */
function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: '#B4FF00' }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}
