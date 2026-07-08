import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import axios from 'axios'

export default function StreakBadge() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/streak').then(r => setData(r.data)).catch(() => {})
  }, [])

  if (!data) return null

  const flameColor = data.goal_met
    ? 'text-[#B4FF00] drop-shadow-[0_0_6px_rgba(180,255,0,0.5)]'
    : 'text-[#7C837A]'

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Flame className={`w-5 h-5 ${flameColor} transition-all duration-300`} />
      <span className={`font-mono text-sm font-bold ${flameColor}`}>
        {data.current_streak}
      </span>
      <span className="text-[10px] text-[#7C837A]">
        {data.today_xp}/{data.daily_goal} XP
      </span>
    </div>
  )
}
