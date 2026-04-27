import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, saveAuth } from '../api/auth'

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0f17' },
  card: { width: '100%', maxWidth: '400px', background: '#151823', border: '1px solid #1e2535', borderRadius: '16px', padding: '40px 32px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px', textAlign: 'center' },
  subtitle: { fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '32px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' },
  input: {
    width: '100%', background: '#1e2130', border: '1px solid #2d3148',
    borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
  },
  btn: {
    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
  },
  toggle: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' },
  toggleLink: { color: '#818cf8', cursor: 'pointer', marginLeft: '4px' },
  error: {
    background: '#2d1515', border: '1px solid #f8717140', borderRadius: '8px',
    padding: '10px 14px', color: '#f87171', fontSize: '13px', marginBottom: '16px',
  },
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fn = isLogin ? login : register
      const res = await fn(email, password)
      saveAuth(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>EasyDeploy</h1>
        <p style={styles.subtitle}>{isLogin ? '로그인하여 서버를 배포하세요.' : '계정을 생성하고 배포를 시작하세요.'}</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>이메일</label>
          <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />

          <label style={styles.label}>비밀번호</label>
          <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />

          <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </button>
        </form>

        <div style={styles.toggle}>
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <span style={styles.toggleLink} onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? ' 회원가입' : ' 로그인'}
          </span>
        </div>
      </div>
    </div>
  )
}
