'use client'

import { useEffect, useState } from 'react'
import { COMMANDS, Command } from '@/lib/commands'

export function CommandPalette({
  onRun,
}: {
  onRun: (type: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={overlay}>
      <div style={palette}>
        <input
          autoFocus
          placeholder="Type a command…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={input}
        />

        <div>
          {filtered.map(cmd => (
            <div
              key={cmd.id}
              onClick={() => {
                onRun(cmd.id)
                setOpen(false)
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                opacity: cmd.dangerous ? 0.7 : 1,
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.background =
                  'rgba(255,255,255,0.06)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              {cmd.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '12vh',
  zIndex: 100,
}

const palette: React.CSSProperties = {
  width: 420,
  borderRadius: 20,
  background: 'rgba(20,20,20,0.95)',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  padding: 14,
}

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  marginBottom: 10,
  background: 'rgba(255,255,255,0.06)',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontSize: 14,
}
