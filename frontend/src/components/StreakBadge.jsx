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
    ? 'text-[var(--color-venom-green)] drop-shadow-[0_0_6px_color-mix(in srgb, var(--color-venom-green) 50%, transparent)]'
    : 'text-[var(--color-ash-steel)]'

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Flame className={`w-5 h-5 ${flameColor} transition-all duration-300`} />
      <span className={`font-mono text-sm font-bold ${flameColor}`}>
        {data.current_streak}
      </span>
      <span className="text-[10px] text-[var(--color-ash-steel)]">
        {data.today_xp}/{data.daily_goal} XP
      </span>
    </div>
  )
}
