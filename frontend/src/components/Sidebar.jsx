import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Terminal, BookOpen, Wrench, Target, HelpCircle, GraduationCap, Github, Sun, Moon } from 'lucide-react'
import StreakBadge from './StreakBadge'

const links = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/phases', label: 'Learning Paths', icon: BookOpen },
  { path: '/commands', label: 'Commands', icon: Terminal },
  { path: '/tools', label: 'Tools', icon: Wrench },
  { path: '/mitre', label: 'MITRE ATT&CK', icon: Target },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  { path: '/glossary', label: 'Glossary', icon: BookOpen },
]

export default function Sidebar({ lightMode, toggleLightMode }) {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col"
      style={{
        backgroundColor: 'var(--color-forged-panel)',
        borderRight: '1px solid color-mix(in srgb, var(--color-ash-steel) 15%, transparent)',
      }}>
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 px-4 py-5 border-b"
        style={{ borderColor: 'color-mix(in srgb, var(--color-ash-steel) 10%, transparent)' }}>
        <span className="text-base font-bold tracking-tight"
          style={{
            fontFamily: '"Rajdhani", "Chakra Petch", sans-serif',
            color: 'var(--color-venom-green)',
            textShadow: '0 0 10px color-mix(in srgb, var(--color-venom-green) 20%, transparent)',
          }}>
          VAPTLearn
        </span>
      </Link>

      {/* Streak badge */}
      <div className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--color-ash-steel) 10%, transparent)' }}>
        <StreakBadge />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-2.5 px-3 py-2 text-sm transition-all duration-150 rounded-sm"
            style={{
              color: isActive(path) ? 'var(--color-venom-green)' : 'var(--color-ash-steel)',
              backgroundColor: isActive(path) ? 'color-mix(in srgb, var(--color-venom-green) 6%, transparent)' : 'transparent',
              borderLeft: isActive(path) ? '2px solid var(--color-venom-green)' : '2px solid transparent',
            }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--color-ash-steel) 10%, transparent)' }}>
        <button onClick={toggleLightMode}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors rounded-sm"
          style={{ color: 'var(--color-ash-steel)' }}>
          {lightMode ? <Moon size={14} /> : <Sun size={14} />}
          <span style={{ color: 'var(--color-ash-steel)' }}>{lightMode ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <a
          href="https://github.com/Yash-Patil-1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-sm hover:text-[var(--color-ice-white)]"
          style={{ color: 'var(--color-ash-steel)' }}
        >
          <Github className="w-4 h-4" />
          GitHub
        </a>
        <p className="text-[10px] px-3 mt-2" style={{ color: 'var(--color-ash-steel)', opacity: 0.6 }}>
          Educational only. Not a hacking tool.
        </p>
      </div>
    </aside>
  )
}
