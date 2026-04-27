const STATUS_CONFIG = {
  PENDING:    { label: '대기 중',  color: '#94a3b8', bg: '#1e293b' },
  RUNNING:    { label: '배포 중',  color: '#38bdf8', bg: '#0c2a3a' },
  SUCCESS:    { label: '완료',    color: '#4ade80', bg: '#052e16' },
  FAILED:     { label: '실패',    color: '#f87171', bg: '#2d1515' },
  CANCELLED:  { label: '취소됨',  color: '#fb923c', bg: '#1c1008' },
  TERMINATED: { label: '종료됨',  color: '#64748b', bg: '#0f1117' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600',
      color: config.color,
      background: config.bg,
      border: `1px solid ${config.color}40`,
    }}>
      {status === 'RUNNING' && <span style={{ marginRight: '5px' }}>⟳</span>}
      {config.label}
    </span>
  )
}
