type Props = {
  title: string
  description: string
  onRun: () => void
}

export function ActionCard({ title, description, onRun }: Props) {
  return (
    <div
      onClick={onRun}
      className="
        rounded-2xl
        bg-black/40
        backdrop-blur-xl
        border border-white/10
        p-4
        text-white
        hover:border-white/20
        transition
      "
      style={{ cursor: 'pointer' }}
    >
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
        {description}
      </div>
    </div>
  )
}
