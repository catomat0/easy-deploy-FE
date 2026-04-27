import { useNavigate } from 'react-router-dom'

const style = {
  position: 'fixed',
  top: '16px',
  right: '24px',
  zIndex: 1000,
  padding: '8px 16px',
  background: '#1e2130',
  border: '1px solid #2d3148',
  borderRadius: '8px',
  color: '#94a3b8',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
}

export default function HomeButton() {
  const navigate = useNavigate()
  return (
    <button style={style} onClick={() => navigate('/')}>
      홈으로
    </button>
  )
}
