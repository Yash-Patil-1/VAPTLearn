import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Shield, AlertTriangle, Target, Wrench } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function CommandDetail() {
  const { id } = useParams()
  const [cmd, setCmd] = useState(null)
  const [copied, setCopied] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true); setError(false)
    axios.get(`/api/commands/${id}`)
      .then(r => { setCmd(r.data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  const copyCommand = () => {
    navigator.clipboard.writeText(cmd.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <Link to="/commands" className="inline-flex items-center gap-1 text-ash-steel mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Commands
        </Link>
        <SkeletonLoader variant="text" lines={4} />
        <div className="mt-6"><SkeletonLoader variant="card" count={3} /></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl">
        <Link to="/commands" className="inline-flex items-center gap-1 text-[#B4FF00] hover:underline mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Commands
        </Link>
        <ErrorMessage message="Command not found or server unavailable." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <Link to="/commands" className="inline-flex items-center gap-1 text-ash-steel hover:text-ice-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Commands
      </Link>

      {/* Header */}
      <h1 className="text-2xl font-bold text-ice-white mb-2">{cmd.name}</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <Tag color="#B4FF00">{cmd.tool}</Tag>
        <Tag color="#7C837A">{cmd.category.replace(/_/g, ' ')}</Tag>
        <Tag color="#FFC400">{cmd.mitre_tactic}</Tag>
        {cmd.os.map(o => <Tag key={o} color="#7C837A">{o}</Tag>)}
      </div>

      {/* Command */}
      <div className="relative mb-8">
        <div className="bg-carbon-black border border-[rgba(124,131,122,0.12)] p-4 font-mono text-sm text-[#B4FF00] overflow-x-auto">
          <code>{cmd.command}</code>
        </div>
        <button onClick={copyCommand} className="absolute top-3 right-3 text-ash-steel hover:text-[#B4FF00] transition-colors">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Description */}
      <Section title="Description">
        <p className="text-[#C9CFC7] text-sm leading-relaxed">{cmd.description}</p>
      </Section>

      {/* Arguments */}
      <Section title="Arguments">
        <div className="space-y-2">
          {Object.entries(cmd.arguments).map(([arg, desc]) => (
            <div key={arg} className="flex gap-3">
              <code className="text-[#B4FF00] font-mono text-xs shrink-0">--{arg}</code>
              <span className="text-[#C9CFC7] text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Expected Output */}
      <Section title="Expected Output">
        <div className="bg-carbon-black border border-[rgba(124,131,122,0.12)] p-4 font-mono text-xs text-[#C9CFC7] whitespace-pre-wrap">{cmd.expected_output}</div>
      </Section>

      {/* MITRE ATT&CK */}
      <Section title="MITRE ATT&CK" icon={Target}>
        <div className="flex gap-2 flex-wrap">
          {cmd.mitre_mapping.map(t => (
            <Tag key={t} color="#B4FF00">{t}</Tag>
          ))}
          <span className="text-xs text-ash-steel self-center ml-2">Tactic: {cmd.mitre_tactic}</span>
        </div>
      </Section>

      {/* Detection */}
      <Section title="Detection (Blue Team)" icon={Shield}>
        <ul className="space-y-1">
          {cmd.detections.map((d, i) => (
            <li key={i} className="text-xs text-[#C9CFC7] flex gap-2">
              <span className="text-[#B4FF00] shrink-0">▸</span> {d}
            </li>
          ))}
        </ul>
      </Section>

      {/* Remediation */}
      <Section title="Remediation">
        <ul className="space-y-1">
          {cmd.remediation.map((r, i) => (
            <li key={i} className="text-xs text-[#C9CFC7] flex gap-2">
              <span className="text-medium shrink-0">▸</span> {r}
            </li>
          ))}
        </ul>
      </Section>

      {/* Common Mistakes */}
      <Section title="Common Mistakes" icon={AlertTriangle}>
        <ul className="space-y-1">
          {cmd.common_mistakes.map((m, i) => (
            <li key={i} className="text-xs text-[#C9CFC7] flex gap-2">
              <span className="text-critical shrink-0">▸</span> {m}
            </li>
          ))}
        </ul>
      </Section>

      {/* Alternatives */}
      <Section title="Alternatives" icon={Wrench}>
        <div className="flex flex-wrap gap-2">
          {cmd.alternatives.map((a, i) => (
            <Tag key={i} color="#7C837A">{a}</Tag>
          ))}
        </div>
      </Section>

      {/* References */}
      {cmd.references?.length > 0 && (
        <Section title="References">
          <ul className="space-y-1">
            {cmd.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-xs text-[#B4FF00] hover:underline hover:text-[#B4FF00]/80 transition-colors">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-ice-white mb-3 uppercase tracking-wider">
        {Icon && <Icon className="w-4 h-4 text-[#B4FF00]" />}
        {title}
      </h2>
      {children}
    </div>
  )
}

function Tag({ color, children }) {
  return (
    <span className="px-2 py-0.5 text-[10px] font-mono inline-flex items-center"
      style={{ border: `1px solid ${color}40`, color }}>
      {children}
    </span>
  )
}
