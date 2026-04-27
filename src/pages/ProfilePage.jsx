import { useNavigate } from 'react-router-dom'
import { getEmail, clearAuth } from '../api/auth'
import TopBar from '../components/TopBar'

const s = {
  page: { maxWidth: '480px', margin: '0 auto', padding: '80px 24px' },
  card: {
    background: '#151823', border: '1px solid #1e2535',
    borderRadius: '16px', padding: '36px',
  },
  title: { fontSize: '22px', fontWeight: '800', color: '#f1f5f9', marginBottom: '32px' },
  row: {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: '16px 0', borderBottom: '1px solid #1e2535',
  },
  label: { fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.8px' },
  value: { fontSize: '15px', color: '#e2e8f0', fontWeight: '500' },
  logoutBtn: {
    width: '100%', marginTop: '28px', padding: '13px',
    background: 'transparent', border: '1px solid #3d1f1f',
    borderRadius: '10px', color: '#f87171',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const email = getEmail()

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div style={s.page}>
      <TopBar />
      <div style={s.card}>
        <div style={s.title}>내 정보</div>
        <div style={s.row}>
          <div style={s.label}>이메일</div>
          <div style={s.value}>{email ?? '—'}</div>
        </div>
        <button style={s.logoutBtn} onClick={logout}>로그아웃</button>
      </div>
    </div>
  )
}
