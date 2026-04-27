import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '56px 24px' },
  back: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', color: '#64748b', cursor: 'pointer',
    background: 'none', border: 'none', marginBottom: '32px', padding: 0,
  },
  title: { fontSize: '28px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '40px', lineHeight: '1.7' },
  card: {
    background: '#151823', border: '1px solid #1e2535',
    borderRadius: '12px', padding: '28px', marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '13px', fontWeight: '600', color: '#7c85a8',
    textTransform: 'uppercase', letterSpacing: '0.8px',
    marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #1e2535',
  },
  step: {
    display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start',
  },
  stepNum: {
    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700', color: '#fff', marginTop: '1px',
  },
  stepBody: { flex: 1 },
  stepLabel: { fontSize: '14px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' },
  stepDesc: { fontSize: '13px', color: '#64748b', lineHeight: '1.7' },
  code: {
    display: 'block', background: '#0f1117', border: '1px solid #1e2535',
    borderRadius: '8px', padding: '14px 16px', fontFamily: 'ui-monospace, monospace',
    fontSize: '12px', color: '#a5b4fc', marginTop: '10px',
    whiteSpace: 'pre', overflowX: 'auto', lineHeight: '1.7',
  },
  inlineCode: {
    background: '#1e2535', padding: '1px 6px', borderRadius: '4px',
    fontFamily: 'ui-monospace, monospace', fontSize: '12px', color: '#a5b4fc',
  },
  warn: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: '#1a1200', border: '1px solid #f59e0b40',
    borderRadius: '8px', padding: '14px 16px', marginTop: '10px',
    fontSize: '13px', color: '#fbbf24', lineHeight: '1.6',
  },
  tip: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: '#0d1f12', border: '1px solid #22c55e30',
    borderRadius: '8px', padding: '14px 16px', marginTop: '10px',
    fontSize: '13px', color: '#86efac', lineHeight: '1.6',
  },
  ctaRow: { display: 'flex', gap: '12px', marginTop: '36px' },
  ctaBtn: {
    flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
  secBtn: {
    flex: 1, padding: '14px', borderRadius: '10px',
    border: '1px solid #1e2535', background: 'transparent',
    color: '#94a3b8', fontSize: '15px', cursor: 'pointer',
  },
}


export default function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <TopBar />
      <button style={s.back} onClick={() => navigate('/')}>← 돌아가기</button>

      <h1 style={s.title}>시작 전 준비 가이드</h1>
      <p style={s.subtitle}>
        배포를 시작하기 전에 AWS IAM Access Key와 GitHub Token이 필요합니다.<br />
        아래 단계를 순서대로 따라하면 5분 안에 준비할 수 있습니다.
      </p>

      {/* AWS IAM */}
      <div style={s.card}>
        <div style={s.sectionTitle}>1단계 — AWS IAM Access Key 발급</div>

        <div style={s.step}>
          <div style={s.stepNum}>1</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>AWS 콘솔 로그인 후 IAM 접속</div>
            <div style={s.stepDesc}>
              AWS 콘솔(console.aws.amazon.com) 우측 상단 계정명 클릭 →{' '}
              <span style={s.inlineCode}>보안 자격 증명</span> 선택,
              또는 검색창에 <span style={s.inlineCode}>IAM</span> 검색 후 접속합니다.
            </div>
          </div>
        </div>

        <div style={s.step}>
          <div style={s.stepNum}>2</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>전용 IAM 사용자 생성</div>
            <div style={s.stepDesc}>
              왼쪽 메뉴 <span style={s.inlineCode}>사용자</span> → <span style={s.inlineCode}>사용자 생성</span><br />
              사용자 이름: <span style={s.inlineCode}>easydeploy-user</span> 입력 후 다음
            </div>
            <div style={s.tip}>
              💡 루트 계정의 Access Key는 절대 사용하지 마세요. 전용 IAM 사용자를 만들어야 안전합니다.
            </div>
          </div>
        </div>

        <div style={s.step}>
          <div style={s.stepNum}>3</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>권한 연결 — AWS 관리형 정책 선택</div>
            <div style={s.stepDesc}>
              권한 설정 화면에서 <span style={s.inlineCode}>직접 정책 연결</span> 선택<br /><br />
              검색창에 아래 정책 이름 입력 후 체크:
            </div>
            <code style={s.code}>{`AmazonEC2FullAccess`}</code>
            <div style={{ ...s.stepDesc, marginTop: '12px' }}>
              체크 후 <span style={s.inlineCode}>다음</span> → <span style={s.inlineCode}>사용자 생성</span> 완료
            </div>
            <div style={s.warn}>
              ⚠️ 필터에서 <span style={s.inlineCode}>AWS 관리형</span>을 선택해야 목록에 표시됩니다.
            </div>
          </div>
        </div>

        <div style={s.step}>
          <div style={s.stepNum}>4</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>Access Key 발급</div>
            <div style={s.stepDesc}>
              생성된 사용자 클릭 → <span style={s.inlineCode}>보안 자격 증명</span> 탭 →{' '}
              <span style={s.inlineCode}>액세스 키 만들기</span><br />
              사용 사례: <span style={s.inlineCode}>서드 파티 서비스</span> 선택<br />
              <span style={{ color: '#475569', fontSize: '12px' }}>
                (EasyDeploy가 외부 서버에서 AWS API를 호출하는 구조이므로 서드 파티 서비스가 적합합니다)
              </span><br /><br />
              <strong style={{ color: '#e2e8f0' }}>Access Key ID</strong>와 <strong style={{ color: '#e2e8f0' }}>Secret Access Key</strong>를 안전한 곳에 보관하세요.
            </div>
            <div style={s.warn}>
              ⚠️ Secret Access Key는 생성 시 한 번만 표시됩니다. 반드시 복사해두세요.
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Token */}
      <div style={s.card}>
        <div style={s.sectionTitle}>2단계 — GitHub Personal Access Token 발급</div>

        <div style={s.step}>
          <div style={s.stepNum}>1</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>GitHub 토큰 설정 페이지 접속</div>
            <div style={s.stepDesc}>
              GitHub 로그인 → 우측 상단 프로필 클릭 → <span style={s.inlineCode}>Settings</span> →
              좌측 메뉴 맨 아래 <span style={s.inlineCode}>Developer settings</span> →{' '}
              <span style={s.inlineCode}>Personal access tokens</span> → <span style={s.inlineCode}>Tokens (classic)</span>
            </div>
            <div style={s.tip}>
              💡 빠른 접근: 브라우저 주소창에 <span style={s.inlineCode}>github.com/settings/tokens</span> 입력
            </div>
          </div>
        </div>

        <div style={s.step}>
          <div style={s.stepNum}>2</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>새 토큰 생성</div>
            <div style={s.stepDesc}>
              우측 상단 <span style={s.inlineCode}>Generate new token (classic)</span> 클릭<br /><br />
              <strong style={{ color: '#e2e8f0' }}>Note (토큰 이름):</strong> <span style={s.inlineCode}>easydeploy</span> 입력<br />
              <strong style={{ color: '#e2e8f0' }}>Expiration:</strong> 원하는 만료 기간 선택 (90 days 권장)
            </div>
          </div>
        </div>

        <div style={s.step}>
          <div style={s.stepNum}>3</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>권한(Scopes) 선택</div>
            <div style={s.stepDesc}>
              아래 두 항목을 체크합니다. <strong style={{ color: '#e2e8f0' }}>repo는 상위 체크박스 하나만 클릭</strong>하면 하위 항목이 전부 선택됩니다.
            </div>
            <code style={s.code}>{`✅ repo                     ← 상위 항목 체크 (하위 전체 자동 선택)
   ├── repo:status
   ├── repo_deployment
   ├── public_repo
   ├── repo:invite
   └── security_events        (코드 읽기 + GitHub Secrets 등록에 필요)

✅ workflow                  ← GitHub Actions 워크플로우 파일 생성에 필요`}</code>
            <div style={s.warn}>
              ⚠️ workflow를 체크하지 않으면 EasyDeploy가 CD 파이프라인 파일을 레포에 자동 생성할 수 없습니다.
            </div>
          </div>
        </div>

        <div style={s.step}>
          <div style={s.stepNum}>4</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>토큰 생성 및 복사</div>
            <div style={s.stepDesc}>
              페이지 하단 <span style={s.inlineCode}>Generate token</span> 버튼 클릭<br />
              생성된 <span style={s.inlineCode}>ghp_</span> 로 시작하는 토큰을 복사해 안전한 곳에 보관하세요.
            </div>
            <div style={s.warn}>
              ⚠️ 토큰은 생성 직후에만 전체가 표시됩니다. 페이지를 벗어나면 다시 볼 수 없어 재발급해야 합니다.
            </div>
          </div>
        </div>
      </div>

      {/* Docker */}
      <div style={s.card}>
        <div style={s.sectionTitle}>3단계 — 레포지토리 준비</div>
        <div style={s.step}>
          <div style={s.stepNum}>1</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>Dockerfile 및 docker-compose.yml 확인</div>
            <div style={s.stepDesc}>
              CD 파이프라인은 Docker Compose 기반으로 동작합니다.<br />
              레포지토리 루트에 두 파일이 있어야 자동 배포가 정상 작동합니다.
            </div>
            <code style={s.code}>{`your-repo/
├── Dockerfile
├── docker-compose.yml   ← 필수
├── src/
└── ...`}</code>
          </div>
        </div>
        <div style={s.step}>
          <div style={s.stepNum}>2</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>.env.prod 내용 준비</div>
            <div style={s.stepDesc}>
              프로덕션에서 사용할 환경변수를 미리 준비해두세요.<br />
              배포 폼에서 직접 입력하면 EC2 서버에 자동으로 주입됩니다.
            </div>
            <code style={s.code}>{`DATABASE_URL=mysql://user:pass@host:3306/db
PORT=8080
JWT_SECRET=your-secret
...`}</code>
          </div>
        </div>
        <div style={s.step}>
          <div style={s.stepNum}>3</div>
          <div style={s.stepBody}>
            <div style={s.stepLabel}>인스턴스 사양 안내</div>
            <div style={s.stepDesc}>
              EasyDeploy는 기본적으로 <strong style={{ color: '#e2e8f0' }}>t3.small (메모리 2GB)</strong> 인스턴스로 생성합니다.<br />
              Docker 이미지 빌드가 EC2에서 직접 수행되므로 최소 2GB 이상을 권장합니다.
            </div>
            <div style={s.warn}>
              ⚠️ t3.micro (1GB)는 Spring Boot 빌드 중 메모리 부족으로 실패할 수 있습니다. 배포 폼에서 인스턴스 타입을 직접 선택할 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      <div style={s.ctaRow}>
        <button style={s.secBtn} onClick={() => navigate('/')}>홈으로</button>
        <button style={s.ctaBtn} onClick={() => navigate('/deploy')}>
          준비 완료 — 배포 시작하기 →
        </button>
      </div>
    </div>
  )
}
