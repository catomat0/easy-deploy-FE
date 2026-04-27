import { useNavigate } from 'react-router-dom'
import { clearAuth } from '../api/auth'

const wrap = {
  position: 'fixed', top: '16px', right: '24px', zIndex: 1000,
  display: 'flex', gap: '8px',
}

const btn = {
  padding: '8px 14px',
  background: '#1e2130', border: '1px solid #2d3148',
  borderRadius: '8px', color: '#94a3b8',
  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
  backdropFilter: 'blur(8px)',
}

const homeBtn = { ...btn }
const profileBtn = { ...btn, color: '#a5b4fc' }
const logoutBtn = { ...btn, color: '#f87171', borderColor: '#3d1f1f' }

export default function TopBar({ showHome = true }) {
  const navigate = useNavigate()

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div style={wrap}>
      {showHome && (
        <button style={homeBtn} onClick={() => navigate('/')}>홈으로</button>
      )}
      <button style={profileBtn} onClick={() => navigate('/profile')}>내 정보</button>
      <button style={logoutBtn} onClick={logout}>로그아웃</button>
    </div>
  )
}
