import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function Commands() {
  const [commands, setCommands] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadCommands = () => {
    axios.get('/api/commands/categories').then(r => setCategories(r.data.categories)).catch(() => {})
  }

  useEffect(() => { loadCommands() }, [])

  useEffect(() => {
    setLoading(true); setError(false)
    if (search.length >= 2) {
      axios.get(`/api/commands/search?q=${search}`).then(r => {
        setCommands(r.data.commands)
        setTotal(r.data.total)
        setLoading(false)
      }).catch(() => { setError(true); setLoading(false) })
    } else {
      const params = category ? `?category=${category}&limit=100` : '?limit=100'
      axios.get(`/api/commands${params}`).then(r => {
        setCommands(r.data.commands)
        setTotal(r.data.total)
        setLoading(false)
      }).catch(() => { setError(true); setLoading(false) })
    }
  }, [search, category])

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-ice-white mb-6">Command Explorer</h1>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-ash-steel" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search commands, tools, techniques..."
            className="w-full bg-carbon-black border border-[rgba(124,131,122,0.15)] px-3 py-2.5 pl-10 text-ice-white text-sm focus:outline-none transition-colors"
            style={{ borderColor: search ? 'rgba(180, 255, 0, 0.3)' : 'rgba(124, 131, 122, 0.15)' }}
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-carbon-black border border-[rgba(124,131,122,0.15)] px-3 py-2.5 text-ice-white text-sm w-48 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-ash-steel mb-4 font-mono">{total > 0 ? `${total} commands` : ''}</p>

      {error ? (
        <ErrorMessage compact message="Failed to load commands." onRetry={() => setError(false)} />
      ) : loading ? (
        <SkeletonLoader variant="list" count={8} />
      ) : (
      <div className="space-y-2">
        {commands.map(cmd => (
          <Link
            key={cmd.id}
            to={`/commands/${cmd.id}`}
            className="block px-5 py-3 transition-all duration-200"
            style={{
              backgroundColor: '#141614',
              border: '1px solid rgba(124, 131, 122, 0.12)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180, 255, 0, 0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124, 131, 122, 0.12)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-ice-white font-medium text-sm">{cmd.name}</h3>
                <code className="text-xs text-[#B4FF00] font-mono mt-1 block truncate">{cmd.command}</code>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <span className="px-2 py-0.5 text-[10px] font-mono"
                  style={{ border: '1px solid rgba(180, 255, 0, 0.2)', color: '#B4FF00' }}>
                  {cmd.tool}
                </span>
                {cmd.mitre_mapping?.[0] && (
                  <span className="px-2 py-0.5 text-[10px] font-mono"
                    style={{ border: '1px solid rgba(180, 255, 0, 0.3)', color: '#B4FF00' }}>
                    {cmd.mitre_mapping[0]}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}
