import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import axios from 'axios'

export default function Commands() {
  const [commands, setCommands] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios.get('/api/commands/categories').then(r => setCategories(r.data.categories))
  }, [])

  useEffect(() => {
    if (search.length >= 2) {
      axios.get(`/api/commands/search?q=${search}`).then(r => {
        setCommands(r.data.commands)
        setTotal(r.data.total)
      })
    } else {
      const params = category ? `?category=${category}&limit=100` : '?limit=100'
      axios.get(`/api/commands${params}`).then(r => {
        setCommands(r.data.commands)
        setTotal(r.data.total)
      })
    }
  }, [search, category])

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-[#F3F3F3] mb-6">Command Explorer</h1>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#949494]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search commands, tools, techniques..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input-field w-48"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-[#949494] mb-4">{total} commands</p>

      {/* Command List */}
      <div className="space-y-2">
        {commands.map(cmd => (
          <Link
            key={cmd.id}
            to={`/commands/${cmd.id}`}
            className="card block hover:border-[#E7C59A]/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-[#F3F3F3] font-medium text-sm">{cmd.name}</h3>
                <code className="text-xs text-[#E7C59A] font-mono mt-1 block truncate">{cmd.command}</code>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <span className="tag-amber">{cmd.tool}</span>
                {cmd.mitre_mapping?.[0] && <span className="tag-green">{cmd.mitre_mapping[0]}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
