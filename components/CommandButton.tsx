'use client'

import { useState } from 'react'

export function CommandButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => Promise<void> | void
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (loading) return
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        ...baseStyle,
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'default' : 'pointer',
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {loading ? 'Running…' : children}
    </button>
  )
}

export function DangerButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => Promise<void> | void
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (loading) return
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        ...baseStyle,
        background: 'rgba(255,0,0,0.12)',
        border: '1px solid rgba(255,0,0,0.3)',
        color: '#ff6b6b',
        opacity: loading ? 0.6 : 1,
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {loading ? 'Executing…' : children}
    </button>
  )
}

const baseStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 14,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  fontSize: 14,
  textAlign: 'left',
  transition: 'background .15s ease, border-color .15s ease, transform .08s ease',
}
