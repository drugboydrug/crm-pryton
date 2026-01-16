'use client'

import { useState } from 'react'

type Props = {
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function ActionModal({ onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (loading) return
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: 420,
          padding: 28,
          borderRadius: 18,
          background: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <h3 style={{ fontSize: 20, marginBottom: 8 }}>
          Internal action
        </h3>

        <p style={{ opacity: 0.5, marginBottom: 20 }}>
          This operation will be connected to backend logic.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              background: 'transparent',
              color: '#EDEDED',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.4 : 1,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              background: '#EDEDED',
              color: '#0A0A0A',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
