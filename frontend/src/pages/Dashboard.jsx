import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, BookOpen, Wrench, Target, ArrowRight, Flame, Zap } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(null)
  const [error, setError] = useState(false)

  const loadData = () => {
    setError(false)
    Promise.all([
      axios.get('/api/commands?limit=1'),
      axios.get('/api/phases/'),
      axios.get('/api/tools/'),
      axios.get('/api/mitre/techniques'),
      axios.get('/api/streak'),
    ]).then(([cmds, phases, tools, mitre, s]) => {
      setStats({
        commands: cmds.data.total,
        phases: phases.data.phases.length,
        tools: tools.data.total,
        techniques: mitre.data.techniques.length,
      })
      setStreak(s.data)
    }).catch(() => setError(true))
  }

  useEffect(() => { loadData() }, [])

  const goalProgress = streak ? Math.min(streak.today_xp / streak.daily_goal * 100, 100) : 0

  return (
    <div className="max-w-5xl">
      {/* Brand header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-ice-white mb-2"
            style={{ fontFamily: '"Rajdhani", "Chakra Petch", sans-serif' }}>
            VAPTLearn
          </h1>
          <p className="text-ash-steel text-lg">
            Penetration testing methodology, commands, and techniques — explained.
          </p>
        </div>

        {/* Streak & XP card */}
        {!stats && !error && <SkeletonLoader variant="streak" />}
        {streak && (
          <div className="flex flex-col items-end gap-2 px-4 py-3 rounded-sm"
            style={{
              backgroundColor: 'rgba(180, 255, 0, 0.04)',
              border: '1px solid rgba(180, 255, 0, 0.1)',
            }}>
            {/* Level */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-1.5 py-0.5"
                style={{
                  backgroundColor: 'rgba(180, 255, 0, 0.1)',
                  border: '1px solid rgba(180, 255, 0, 0.25)',
                  color: '#B4FF00',
                }}>
                LVL {streak.level}
              </span>
              {!streak.max_level_reached && (
                <span className="text-[10px] font-mono text-ash-steel">
                  {streak.level_xp}/{streak.next_level_xp} XP
                </span>
              )}
            </div>
            {/* Level XP bar */}
            {!streak.max_level_reached && (
              <div className="w-40 h-1 rounded-full mb-2" style={{ backgroundColor: 'rgba(124, 131, 122, 0.15)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(streak.level_xp / streak.next_level_xp) * 100}%`,
                    backgroundColor: '#FF5C00',
                  }} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${streak.goal_met ? 'text-[#B4FF00]' : 'text-ash-steel'}`}
                style={streak.goal_met ? { filter: 'drop-shadow(0 0 6px rgba(180,255,0,0.5))' } : {}} />
              <span className={`font-mono text-lg font-bold ${streak.goal_met ? 'text-[#B4FF00]' : 'text-ash-steel'}`}>
                {streak.current_streak}
              </span>
              <span className="text-xs text-ash-steel font-mono">day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-high" />
              <span className="text-sm font-mono text-ice-white">{streak.total_xp} XP</span>
            </div>
            {/* Daily XP bar */}
            <div className="w-40 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'rgba(124, 131, 122, 0.15)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${goalProgress}%`,
                  background: 'linear-gradient(90deg, #B4FF00, #FF5C00)',
                }} />
            </div>
          </div>
        )}
      </div>

      {/* XP week strip */}
      {streak && (
        <div className="flex gap-2 mb-8 items-end">
          {streak.last_7_days.map((day, i) => {
            const pct = day.xp > 0 ? Math.min(day.xp / streak.daily_goal, 1) : 0
            const h = Math.max(4, pct * 28)
            return (
              <div key={day.date} className="flex flex-col items-center gap-1">
                <div className="w-6 rounded-sm transition-all duration-300"
                  style={{
                    height: `${h}px`,
                    backgroundColor: pct >= 1
                      ? '#B4FF00'
                      : pct > 0
                        ? 'rgba(180, 255, 0, 0.3)'
                        : 'rgba(124, 131, 122, 0.08)',
                    boxShadow: pct >= 1 ? '0 0 8px rgba(180, 255, 0, 0.3)' : 'none',
                  }} />
                <span className="text-[8px] font-mono text-ash-steel">
                  {day.date.slice(-2)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats */}
      {error ? (
        <ErrorMessage message="Failed to load dashboard data. Is the backend running?" onRetry={loadData} />
      ) : !stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <SkeletonLoader variant="stat" count={4} />
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard icon={Terminal} label="Commands" value={stats.commands} />
        <StatCard icon={BookOpen} label="Phases" value={stats.phases} />
        <StatCard icon={Wrench} label="Tools" value={stats.tools} />
        <StatCard icon={Target} label="ATT&CK Techniques" value={stats.techniques} />
      </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <QuickLink to="/learn" title="Guided Lessons" desc="Learn VAPT methodology step by step" />
        <QuickLink to="/commands" title="Command Explorer" desc="Browse 400+ commands with MITRE mapping" />
        <QuickLink to="/phases" title="Learning Paths" desc="Follow PTES methodology phase by phase" />
        <QuickLink to="/tools" title="Tool Library" desc="70+ tools with installation and usage" />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center py-5 rounded-sm"
      style={{
        backgroundColor: '#141614',
        border: '1px solid rgba(124, 131, 122, 0.12)',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
      }}>
      <Icon className="w-5 h-5 text-[#B4FF00] mb-2" />
      <span className="text-2xl font-bold text-ice-white font-mono">{value}</span>
      <span className="text-xs text-ash-steel mt-0.5">{label}</span>
    </div>
  )
}

function QuickLink({ to, title, desc }) {
  return (
    <Link to={to}
      className="flex items-center justify-between px-5 py-4 rounded-sm transition-all duration-200 group"
      style={{
        backgroundColor: '#141614',
        border: '1px solid rgba(124, 131, 122, 0.12)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(180, 255, 0, 0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124, 131, 122, 0.12)'}>
      <div>
        <h3 className="text-ice-white font-medium text-sm">{title}</h3>
        <p className="text-xs text-ash-steel mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-ash-steel group-hover:text-[#B4FF00] transition-colors" />
    </Link>
  )
}
