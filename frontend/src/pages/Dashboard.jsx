import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, BookOpen, Wrench, Target, ArrowRight } from 'lucide-react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/commands?limit=1'),
      axios.get('/api/phases/'),
      axios.get('/api/tools/'),
      axios.get('/api/mitre/techniques'),
    ]).then(([cmds, phases, tools, mitre]) => {
      setStats({
        commands: cmds.data.total,
        phases: phases.data.phases.length,
        tools: tools.data.total,
        techniques: mitre.data.techniques.length,
      })
    }).catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-bold text-[#F3F3F3] mb-2">VAPTLearn</h1>
      <p className="text-[#949494] text-lg mb-10">
        Penetration testing methodology, commands, and techniques — explained.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard icon={Terminal} label="Commands" value={stats?.commands || '—'} />
        <StatCard icon={BookOpen} label="Phases" value={stats?.phases || '—'} />
        <StatCard icon={Wrench} label="Tools" value={stats?.tools || '—'} />
        <StatCard icon={Target} label="ATT&CK Techniques" value={stats?.techniques || '—'} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLink to="/commands" title="Command Explorer" desc="Browse 400+ commands with MITRE mapping" />
        <QuickLink to="/phases" title="Learning Paths" desc="Follow PTES methodology phase by phase" />
        <QuickLink to="/tools" title="Tool Library" desc="70+ tools with installation and usage" />
        <QuickLink to="/mitre" title="MITRE ATT&CK" desc="Techniques mapped to real commands" />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card flex flex-col items-center text-center py-6">
      <Icon className="w-6 h-6 text-[#E7C59A] mb-2" />
      <span className="text-2xl font-bold text-[#F3F3F3]">{value}</span>
      <span className="text-xs text-[#949494] mt-1">{label}</span>
    </div>
  )
}

function QuickLink({ to, title, desc }) {
  return (
    <Link to={to} className="card group flex items-center justify-between hover:border-[#E7C59A]/30 transition-colors">
      <div>
        <h3 className="text-[#F3F3F3] font-medium">{title}</h3>
        <p className="text-xs text-[#949494] mt-1">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-[#949494] group-hover:text-[#E7C59A] transition-colors" />
    </Link>
  )
}
