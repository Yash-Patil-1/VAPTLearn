import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Phases() {
  const [phases, setPhases] = useState([])

  useEffect(() => {
    axios.get('/api/phases/').then(r => setPhases(r.data.phases))
  }, [])

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-[#F3F3F3] mb-2">Learning Paths</h1>
      <p className="text-[#949494] mb-8">Follow the PTES methodology phase by phase.</p>

      <div className="space-y-4">
        {phases.map((phase, i) => (
          <Link key={phase.id} to={`/commands?phase=${phase.id}`} className="card block hover:border-[#E7C59A]/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#E7C59A]/10 flex items-center justify-center shrink-0">
                <span className="text-[#E7C59A] font-bold text-sm">{phase.id}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-[#F3F3F3] font-medium">{phase.name}</h3>
                <p className="text-xs text-[#949494] mt-1">{phase.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="tag-amber">{phase.command_count} commands</span>
                  <span className="tag-default">{phase.methodology}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
