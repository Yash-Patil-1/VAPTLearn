import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Shield, AlertTriangle, Target, Wrench } from 'lucide-react'
import axios from 'axios'

export default function CommandDetail() {
  const { id } = useParams()
  const [cmd, setCmd] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    axios.get(`/api/commands/${id}`).then(r => setCmd(r.data)).catch(() => {})
  }, [id])

  const copyCommand = () => {
    navigator.clipboard.writeText(cmd.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!cmd) return <div className="text-[#949494]">Loading...</div>

  return (
    <div className="max-w-4xl">
      <Link to="/commands" className="inline-flex items-center gap-1 text-[#949494] hover:text-[#F3F3F3] text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Commands
      </Link>

      {/* Header */}
      <h1 className="text-2xl font-bold text-[#F3F3F3] mb-2">{cmd.name}</h1>
      <div className="flex gap-2 mb-6">
        <span className="tag-amber">{cmd.tool}</span>
        <span className="tag-default">{cmd.category.replace(/_/g, ' ')}</span>
        <span className="tag-green">{cmd.mitre_tactic}</span>
        {cmd.os.map(o => <span key={o} className="tag-default">{o}</span>)}
      </div>

      {/* Command */}
      <div className="relative mb-8">
        <div className="code-block">
          <code>{cmd.command}</code>
        </div>
        <button onClick={copyCommand} className="absolute top-3 right-3 text-[#949494] hover:text-[#E7C59A]">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Description */}
      <Section title="Description">
        <p className="text-[#C1C1C1] text-sm leading-relaxed">{cmd.description}</p>
      </Section>

      {/* Arguments */}
      <Section title="Arguments">
        <div className="space-y-2">
          {Object.entries(cmd.arguments).map(([arg, desc]) => (
            <div key={arg} className="flex gap-3">
              <code className="text-[#E7C59A] font-mono text-xs shrink-0">{arg}</code>
              <span className="text-[#C1C1C1] text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Expected Output */}
      <Section title="Expected Output">
        <div className="code-block whitespace-pre-wrap text-xs">{cmd.expected_output}</div>
      </Section>

      {/* MITRE ATT&CK */}
      <Section title="MITRE ATT&CK" icon={Target}>
        <div className="flex gap-2 flex-wrap">
          {cmd.mitre_mapping.map(t => (
            <span key={t} className="tag-green">{t}</span>
          ))}
          <span className="text-xs text-[#949494] self-center ml-2">Tactic: {cmd.mitre_tactic}</span>
        </div>
      </Section>

      {/* Detection */}
      <Section title="Detection (Blue Team)" icon={Shield}>
        <ul className="space-y-1">
          {cmd.detections.map((d, i) => (
            <li key={i} className="text-xs text-[#C1C1C1] flex gap-2">
              <span className="text-[#00AC5C]">•</span> {d}
            </li>
          ))}
        </ul>
      </Section>

      {/* Remediation */}
      <Section title="Remediation">
        <ul className="space-y-1">
          {cmd.remediation.map((r, i) => (
            <li key={i} className="text-xs text-[#C1C1C1] flex gap-2">
              <span className="text-[#E7C59A]">•</span> {r}
            </li>
          ))}
        </ul>
      </Section>

      {/* Common Mistakes */}
      <Section title="Common Mistakes" icon={AlertTriangle}>
        <ul className="space-y-1">
          {cmd.common_mistakes.map((m, i) => (
            <li key={i} className="text-xs text-[#C1C1C1] flex gap-2">
              <span className="text-red-400">•</span> {m}
            </li>
          ))}
        </ul>
      </Section>

      {/* Alternatives */}
      <Section title="Alternatives" icon={Wrench}>
        <div className="flex flex-wrap gap-2">
          {cmd.alternatives.map((a, i) => (
            <span key={i} className="tag-default">{a}</span>
          ))}
        </div>
      </Section>

      {/* References */}
      {cmd.references?.length > 0 && (
        <Section title="References">
          <ul className="space-y-1">
            {cmd.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E7C59A] hover:underline">
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
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[#F3F3F3] mb-3">
        {Icon && <Icon className="w-4 h-4 text-[#E7C59A]" />}
        {title}
      </h2>
      {children}
    </div>
  )
}
