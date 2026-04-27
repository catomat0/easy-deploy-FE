import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'


const styles = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '64px 24px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '56px',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #6366f120, #8b5cf620)',
    border: '1px solid #6366f140',
    color: '#a5b4fc',
    marginBottom: '20px',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#f1f5f9',
    lineHeight: '1.2',
    marginBottom: '16px',
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.7',
    maxWidth: '560px',
    margin: '0 auto 36px',
  },
  ctaBtn: {
    display: 'inline-block',
    padding: '14px 36px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#7c85a8',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #1e2535',
  },
  card: {
    background: '#151823',
    border: '1px solid #1e2535',
    borderRadius: '12px',
    padding: '24px 28px',
    marginBottom: '32px',
  },
  stepGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    background: '#0f1117',
    borderRadius: '8px',
    border: '1px solid #1e2535',
  },
  stepIcon: {
    fontSize: '20px',
    flexShrink: 0,
    marginTop: '1px',
  },
  stepText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stepLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  stepDesc: {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  dockerBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '18px 20px',
    background: '#1a1200',
    border: '1px solid #f59e0b40',
    borderRadius: '10px',
    marginBottom: '32px',
  },
  dockerIcon: {
    fontSize: '22px',
    flexShrink: 0,
    marginTop: '1px',
  },
  dockerText: {
    fontSize: '13px',
    color: '#fbbf24',
    lineHeight: '1.7',
  },
  dockerTitle: {
    fontWeight: '700',
    fontSize: '14px',
    marginBottom: '4px',
  },
  prereqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  prereqItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#94a3b8',
  },
  prereqDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#6366f1',
    flexShrink: 0,
  },
  prereqRequired: {
    color: '#f87171',
    fontSize: '11px',
    fontWeight: '600',
    marginLeft: '6px',
  },
  onboardingBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px 20px',
    background: '#0d1120',
    border: '1px solid #6366f130',
    borderRadius: '10px',
    marginBottom: '32px',
  },
  onboardingText: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  onboardingBtn: {
    flexShrink: 0,
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #6366f150',
    background: 'transparent',
    color: '#a5b4fc',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  ctaRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '8px',
  },
  secondaryBtn: {
    padding: '14px 28px',
    borderRadius: '10px',
    border: '1px solid #1e2535',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

const STEPS = [
  { icon: '🔑', label: 'EC2 키페어 생성', desc: 'SSH 접속용 키페어 자동 생성' },
  { icon: '🛡️', label: '보안그룹 설정', desc: '80, 443, 8080, 22 포트 자동 개방' },
  { icon: '🖥️', label: 'EC2 인스턴스 시작', desc: 'Ubuntu 22.04 + EIP 할당' },
  { icon: '🐳', label: 'Docker 설치', desc: 'Docker + GitHub Actions 연동 권한 설정' },
  { icon: '🌐', label: 'nginx 리버스 프록시', desc: '80/443 → 8080 자동 구성' },
  { icon: '🔒', label: 'HTTPS 인증서', desc: 'certbot으로 Let\'s Encrypt 자동 발급' },
  { icon: '⚙️', label: 'GitHub Actions CD', desc: 'Docker 기반 자동 배포 워크플로우 생성' },
]

export default function IntroPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <TopBar showHome={false} />
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>Spring Boot 백엔드 서버 자동 배포</div>
        <h1 style={styles.title}>
          몇 번의 클릭으로<br />
          <span style={styles.titleAccent}>프로덕션 서버</span>를 완성하세요
        </h1>
        <p style={styles.subtitle}>
          AWS EC2 생성부터 nginx 리버스 프록시, HTTPS 인증서, GitHub Actions CD 파이프라인까지
          모든 인프라 설정을 자동으로 처리합니다.
        </p>
        <button
          style={styles.ctaBtn}
          onClick={() => navigate('/deploy')}
          onMouseEnter={e => (e.target.style.opacity = '0.85')}
          onMouseLeave={e => (e.target.style.opacity = '1')}
        >
          배포 시작하기 →
        </button>
      </div>

      {/* 온보딩 안내 배너 */}
      <div style={styles.onboardingBanner}>
        <div style={styles.onboardingText}>
          <strong style={{ color: '#e2e8f0' }}>처음 시작하시나요?</strong>
          {' '}배포 전에 AWS IAM Access Key와 GitHub Token이 필요합니다.
          발급 방법과 필요한 권한을 단계별로 안내해드립니다.
        </div>
        <button
          style={styles.onboardingBtn}
          onClick={() => navigate('/onboarding')}
          onMouseEnter={e => (e.target.style.borderColor = '#6366f1')}
          onMouseLeave={e => (e.target.style.borderColor = '#6366f130')}
        >
          준비 가이드 보기 →
        </button>
      </div>

      {/* Docker prerequisite banner */}
      <div style={styles.dockerBanner}>
        <div style={styles.dockerIcon}>🐳</div>
        <div style={styles.dockerText}>
          <div style={styles.dockerTitle}>GitHub Actions CD는 Docker를 전제로 합니다</div>
          자동 생성되는 CD 워크플로우는 <strong>Docker Compose</strong> 기반으로 동작합니다.
          배포할 레포지토리 루트에 <code style={{ background: '#2a1f00', padding: '1px 5px', borderRadius: '3px' }}>docker-compose.yml</code>과
          {' '}<code style={{ background: '#2a1f00', padding: '1px 5px', borderRadius: '3px' }}>Dockerfile</code>이 반드시 포함되어 있어야 합니다.
          없을 경우 Node.js(pm2) 또는 Python(pm2) 방식으로 폴백됩니다.
        </div>
      </div>

      {/* Automated steps */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>자동으로 처리되는 항목</div>
        <div style={styles.stepGrid}>
          {STEPS.map(s => (
            <div key={s.label} style={styles.stepItem}>
              <span style={styles.stepIcon}>{s.icon}</span>
              <div style={styles.stepText}>
                <span style={styles.stepLabel}>{s.label}</span>
                <span style={styles.stepDesc}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>시작 전 준비사항</div>
        <div style={styles.prereqList}>
          <div style={styles.prereqItem}>
            <div style={styles.prereqDot} />
            AWS 계정 및 IAM Access Key (EC2 + EIP 권한 포함)
            <span style={styles.prereqRequired}>필수</span>
          </div>
          <div style={styles.prereqItem}>
            <div style={styles.prereqDot} />
            GitHub Personal Access Token (repo + secrets 권한)
            <span style={styles.prereqRequired}>필수</span>
          </div>
          <div style={styles.prereqItem}>
            <div style={styles.prereqDot} />
            레포지토리에 <code style={{ fontSize: '12px', color: '#a5b4fc' }}>docker-compose.yml</code> 및 <code style={{ fontSize: '12px', color: '#a5b4fc' }}>Dockerfile</code> 포함
            <span style={styles.prereqRequired}>CD 필수</span>
          </div>
          <div style={styles.prereqItem}>
            <div style={styles.prereqDot} />
            프로덕션 환경변수 (.env.prod 내용)
            <span style={styles.prereqRequired}>필수</span>
          </div>
        </div>
      </div>

      <div style={styles.ctaRow}>
        <button
          style={styles.secondaryBtn}
          onClick={() => navigate('/onboarding')}
        >
          준비 가이드
        </button>
        <button
          style={styles.secondaryBtn}
          onClick={() => navigate('/servers')}
        >
          내 서버
        </button>
        <button
          style={styles.ctaBtn}
          onClick={() => navigate('/deploy')}
          onMouseEnter={e => (e.target.style.opacity = '0.85')}
          onMouseLeave={e => (e.target.style.opacity = '1')}
        >
          배포 시작하기 →
        </button>
      </div>
    </div>
  )
}
