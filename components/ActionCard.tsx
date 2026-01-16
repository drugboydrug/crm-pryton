type Props = {
  title: string
  description: string
  onRun: () => void
}

export function ActionCard({ title, description, onRun }: Props) {
  return (
    <div
      onClick={onRun}
      style={{
        padding: 20,
        borderRadius: 14,
        background: '#0B0B0B',
        border: '1px solid #1A1A1A',
        cursor: 'pointer',
        transition: 'all .2s',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
        {description}
      </div>
    </div>
  )
}
