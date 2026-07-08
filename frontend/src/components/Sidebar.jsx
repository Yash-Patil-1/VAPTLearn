import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Terminal, BookOpen, Wrench, Target, HelpCircle, GraduationCap, Github } from 'lucide-react'
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

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col"
      style={{
        backgroundColor: '#141614',
        borderRight: '1px solid rgba(124, 131, 122, 0.15)',
      }}>
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 px-4 py-5 border-b"
        style={{ borderColor: 'rgba(124, 131, 122, 0.1)' }}>
        <span className="text-base font-bold tracking-tight"
          style={{
            fontFamily: '"Rajdhani", "Chakra Petch", sans-serif',
            color: '#B4FF00',
            textShadow: '0 0 10px rgba(180, 255, 0, 0.2)',
          }}>
          VAPTLearn
        </span>
      </Link>

      {/* Streak badge */}
      <div className="border-b" style={{ borderColor: 'rgba(124, 131, 122, 0.1)' }}>
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
              color: isActive(path) ? '#B4FF00' : '#7C837A',
              backgroundColor: isActive(path) ? 'rgba(180, 255, 0, 0.06)' : 'transparent',
              borderLeft: isActive(path) ? '2px solid #B4FF00' : '2px solid transparent',
              fontFamily: isActive(path) ? '"Inter", sans-serif' : '"Inter", sans-serif',
            }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(124, 131, 122, 0.1)' }}>
        <a
          href="https://github.com/Yash-Patil-1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#7C837A] hover:text-[#EAEEE8] transition-colors rounded-sm"
        >
          <Github className="w-4 h-4" />
          GitHub
        </a>
        <p className="text-[10px] px-3 mt-2" style={{ color: '#7C837A', opacity: 0.6 }}>
          Educational only. Not a hacking tool.
        </p>
      </div>
    </aside>
  )
}
