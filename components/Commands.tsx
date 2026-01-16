type Props = {
    onSync: () => void
  }
  
  export function Commands({ onSync }: Props) {
    return (
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: '#0D0D0D',
          border: '1px solid #1A1A1A',
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 12 }}>
          Commands
        </div>
  
        <button
          onClick={onSync}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            background: '#111',
            border: '1px solid #222',
            color: '#EDEDED',
            cursor: 'pointer',
          }}
        >
          Run sync
        </button>
      </div>
    )
  }
  