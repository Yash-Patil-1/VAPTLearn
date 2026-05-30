import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Tools() {
  const [tools, setTools] = useState([])

  useEffect(() => {
    axios.get('/api/tools/').then(r => setTools(r.data.tools))
  }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-[#F3F3F3] mb-2">Tool Library</h1>
      <p className="text-[#949494] mb-8">{tools.length} tools documented with usage examples.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map(tool => (
          <div key={tool.id} className="card hover:border-[#E7C59A]/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[#F3F3F3] font-medium">{tool.name}</h3>
                <p className="text-xs text-[#949494] mt-1 line-clamp-2">{tool.description}</p>
              </div>
              <span className="tag-amber shrink-0 ml-2">{tool.command_count}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <span className="tag-default">{tool.category.replace(/_/g, ' ')}</span>
              {tool.platforms?.slice(0, 2).map(p => (
                <span key={p} className="tag-default">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
