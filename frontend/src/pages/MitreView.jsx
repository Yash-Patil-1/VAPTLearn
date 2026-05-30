import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MitreView() {
  const [tactics, setTactics] = useState([])

  useEffect(() => {
    axios.get('/api/mitre/tactics').then(r => setTactics(r.data.tactics))
  }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-[#F3F3F3] mb-2">MITRE ATT&CK</h1>
      <p className="text-[#949494] mb-8">Techniques mapped to real penetration testing commands.</p>

      <div className="space-y-6">
        {tactics.map(tactic => (
          <div key={tactic.id} className="card">
            <h2 className="text-[#E7C59A] font-medium mb-3">
              {tactic.id} — {tactic.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tactic.techniques.map(tech => (
                <div key={tech.id} className="flex items-center gap-2 p-2 rounded bg-[#080808] border border-[#333]">
                  <span className="text-[#00AC5C] font-mono text-xs">{tech.id}</span>
                  <span className="text-xs text-[#C1C1C1] truncate">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
