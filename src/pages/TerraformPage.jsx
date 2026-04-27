import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTerraformFiles } from '../api/deploy'
import TopBar from '../components/TopBar'

const PHASES = [
  {
    label: '로컬 개발',
    color: '#6366f1',
    bg: '#6366f110',
    steps: [
      {
        icon: '🧑‍💻',
        title: '코드 작성',
        desc: '개발자가 로컬 환경에서 백엔드 코드 작성 (Spring Boot, Node.js 등)',
        outputs: [],
      },
      {
        icon: '🐳',
        title: 'Dockerfile 작성',
        desc: '앱을 Docker 이미지로 패키징하는 방법 정의. 빌드 → 실행 환경을 명세한 레시피',
        outputs: ['Docker Image'],
      },
      {
        icon: '📋',
        title: 'docker-compose.yml 작성',
        desc: '앱 · DB(MySQL) · 캐시(Redis) 등 여러 컨테이너를 한 번에 띄우는 구성 파일. 포트, 볼륨, 환경변수를 정의',
        outputs: [],
      },
    ],
  },
  {
    label: 'EC2 서버 인프라',
    color: '#8b5cf6',
    bg: '#8b5cf610',
    steps: [
      {
        icon: '☁️',
        title: 'EC2 인스턴스',
        desc: 'AWS에서 제공하는 가상 서버. 앱이 실제로 실행되는 컴퓨터. 인스턴스 타입(t3.small 등)으로 사양 결정',
        outputs: ['Public IP'],
      },
      {
        icon: '🔒',
        title: '보안 그룹 (Security Group)',
        desc: 'EC2의 방화벽. 외부에서 접근 가능한 포트를 제어 — 22(SSH), 80(HTTP), 443(HTTPS), 8080(앱) 개방',
        outputs: [],
      },
      {
        icon: '🔄',
        title: 'nginx (리버스 프록시)',
        desc: '외부 요청(포트 80)을 받아 내부 앱(포트 8080)으로 전달. 도메인 연결·SSL 처리도 담당',
        outputs: ['80 → 8080'],
      },
    ],
  },
  {
    label: '최초 배포',
    color: '#06b6d4',
    bg: '#06b6d410',
    steps: [
      {
        icon: '📦',
        title: 'EC2에 Docker 설치',
        desc: 'Docker · docker-compose 설치. 이후 모든 앱 실행은 Docker가 담당',
        outputs: [],
      },
      {
        icon: '📥',
        title: 'GitHub 레포 클론',
        desc: 'EC2 서버에서 git clone으로 소스코드 다운로드',
        outputs: [],
      },
      {
        icon: '▶️',
        title: 'docker-compose up',
        desc: 'docker-compose.yml을 읽어 컨테이너 빌드 후 실행. 앱 · DB · Redis가 한 번에 기동',
        outputs: ['앱 서비스 시작'],
      },
    ],
  },
  {
    label: '지속적 배포 (CD)',
    color: '#10b981',
    bg: '#10b98110',
    steps: [
      {
        icon: '⬆️',
        title: 'git push (main 브랜치)',
        desc: '개발자가 새 코드를 GitHub main 브랜치에 push',
        outputs: [],
      },
      {
        icon: '⚙️',
        title: 'GitHub Actions 워크플로우 트리거',
        desc: 'push 이벤트를 감지해 자동으로 워크플로우 실행. EC2_HOST · SSH_KEY · ENV_PROD 등 Secrets를 사용',
        outputs: [],
      },
      {
        icon: '🔗',
        title: 'EC2 SSH 접속 → 재배포',
        desc: 'GitHub Actions가 SSH로 EC2에 접속해 git pull → docker-compose up --build 실행. 새 코드가 자동 반영됨',
        outputs: ['자동 재배포 완료'],
      },
    ],
  },
]

const wfStyles = {
  section: {
    marginTop: '56px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  sectionSub: {
    fontSize: '13px',
    color: '#475569',
    marginBottom: '28px',
  },
  phase: {
    marginBottom: '8px',
  },
  phaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  phaseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  phaseLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  phaseLine: {
    flex: 1,
    height: '1px',
    background: '#1e2535',
  },
  stepsWrap: {
    paddingLeft: '16px',
    borderLeft: '2px solid #1e2535',
    marginLeft: '3px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0',
    position: 'relative',
  },
  connectorWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '28px',
    flexShrink: 0,
    paddingTop: '12px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '2px solid',
    background: '#0c0f1a',
    flexShrink: 0,
  },
  arrow: {
    width: '1px',
    flex: 1,
    minHeight: '20px',
    background: 'linear-gradient(to bottom, #2d3148, #1e2535)',
  },
  arrowHead: {
    fontSize: '9px',
    color: '#2d3148',
    lineHeight: 1,
    marginTop: '-2px',
  },
  stepCard: {
    flex: 1,
    background: '#0f1117',
    border: '1px solid #1e2535',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '8px',
    marginTop: '6px',
  },
  stepTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  stepIcon: {
    fontSize: '15px',
    lineHeight: 1,
  },
  stepTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  stepDesc: {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.6',
    marginLeft: '23px',
  },
  outputRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
    marginLeft: '23px',
  },
  outputBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid',
    fontFamily: 'ui-monospace, monospace',
  },
  phaseArrow: {
    textAlign: 'center',
    color: '#2d3148',
    fontSize: '16px',
    margin: '2px 0 2px 3px',
    lineHeight: 1,
  },
}

function DeployWorkflow() {
  return (
    <div style={wfStyles.section}>
      <div style={wfStyles.sectionTitle}>백엔드 서버 배포 흐름</div>
      <div style={wfStyles.sectionSub}>코드 작성부터 EC2에서 앱이 실행되고 자동 재배포까지의 일반적인 흐름</div>

      <div style={{
        background: '#0d1120', border: '1px solid #6366f130',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '28px',
        fontSize: '13px', color: '#94a3b8', lineHeight: '1.8',
      }}>
        <strong style={{ color: '#a5b4fc', display: 'block', marginBottom: '8px' }}>📌 EasyDeploy 지원 범위</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>✅ <strong style={{ color: '#e2e8f0' }}>단일 EC2 서버에 Docker로 앱 · DB · Redis를 함께 올리는 구성</strong>을 지원합니다. docker-compose.yml에 여러 서비스를 정의하면 한 번에 기동됩니다.</div>
          <div>✅ <strong style={{ color: '#e2e8f0' }}>소스코드 기반 빌드</strong> — EC2에서 직접 <code style={{ background: '#1e2535', padding: '1px 5px', borderRadius: '3px', fontSize: '11px' }}>docker-compose up --build</code>로 이미지를 빌드해 실행합니다. Dockerfile이 레포 루트에 있어야 합니다.</div>
          <div>✅ <strong style={{ color: '#e2e8f0' }}>Docker Hub 퍼블릭 이미지</strong> — docker-compose.yml에 <code style={{ background: '#1e2535', padding: '1px 5px', borderRadius: '3px', fontSize: '11px' }}>image: myuser/myapp</code>만 있는 경우, 퍼블릭 이미지라면 자동으로 pull해 실행됩니다.</div>
          <div>❌ <strong style={{ color: '#f87171' }}>Docker Hub 프라이빗 이미지</strong> — docker login 설정이 자동으로 주입되지 않아 pull에 실패합니다.</div>
          <div>❌ <strong style={{ color: '#f87171' }}>CI에서 이미지 빌드 후 Hub에 push하는 워크플로우</strong> — EasyDeploy가 생성하는 GitHub Actions는 EC2에서 직접 빌드하는 방식입니다. Hub에 push하는 단계는 별도로 직접 구성해야 합니다.</div>
        </div>
      </div>

      {PHASES.map((phase, pi) => (
        <div key={phase.label}>
          <div style={wfStyles.phase}>
            <div style={wfStyles.phaseHeader}>
              <div style={{ ...wfStyles.phaseDot, background: phase.color }} />
              <span style={{ ...wfStyles.phaseLabel, color: phase.color }}>{phase.label}</span>
              <div style={wfStyles.phaseLine} />
            </div>

            <div style={wfStyles.stepsWrap}>
              {phase.steps.map((step, si) => (
                <div key={step.title} style={wfStyles.stepRow}>
                  <div style={wfStyles.connectorWrap}>
                    <div style={{ ...wfStyles.dot, borderColor: phase.color }} />
                    {(si < phase.steps.length - 1) && (
                      <>
                        <div style={wfStyles.arrow} />
                        <div style={wfStyles.arrowHead}>▼</div>
                      </>
                    )}
                  </div>
                  <div style={{ ...wfStyles.stepCard, borderColor: phase.bg === '#6366f110' ? '#1e2535' : phase.bg.replace('10', '30') }}>
                    <div style={wfStyles.stepTop}>
                      <span style={wfStyles.stepIcon}>{step.icon}</span>
                      <span style={{ ...wfStyles.stepTitle, color: phase.color === '#6366f1' ? '#a5b4fc' : phase.color === '#8b5cf6' ? '#c4b5fd' : phase.color === '#06b6d4' ? '#67e8f9' : phase.color === '#10b981' ? '#6ee7b7' : '#fde68a' }}>{step.title}</span>
                    </div>
                    <div style={wfStyles.stepDesc}>{step.desc}</div>
                    {step.outputs.length > 0 && (
                      <div style={wfStyles.outputRow}>
                        {step.outputs.map(o => (
                          <span
                            key={o}
                            style={{
                              ...wfStyles.outputBadge,
                              color: phase.color,
                              borderColor: phase.color + '50',
                              background: phase.bg,
                            }}
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pi < PHASES.length - 1 && (
            <div style={wfStyles.phaseArrow}>▼</div>
          )}
        </div>
      ))}
    </div>
  )
}

const styles = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '32px',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  backBtn: {
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '8px 14px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  titleWrap: {},
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#475569',
  },
  infoBanner: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    background: '#0d1120',
    border: '1px solid #6366f130',
    borderRadius: '10px',
    padding: '14px 18px',
    marginBottom: '28px',
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.7',
  },
  infoIcon: { fontSize: '16px', flexShrink: 0, marginTop: '1px' },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '0',
    borderBottom: '1px solid #1e2535',
  },
  tab: {
    padding: '10px 18px',
    borderRadius: '8px 8px 0 0',
    border: '1px solid transparent',
    borderBottom: 'none',
    background: 'transparent',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'ui-monospace, monospace',
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  tabActive: {
    background: '#151823',
    border: '1px solid #1e2535',
    borderBottom: '1px solid #151823',
    color: '#a5b4fc',
  },
  codePanel: {
    background: '#151823',
    border: '1px solid #1e2535',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
    overflow: 'hidden',
  },
  codePanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid #1e2535',
    background: '#0f1117',
  },
  fileName: {
    fontFamily: 'ui-monospace, monospace',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  btnRow: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '5px 12px',
    borderRadius: '6px',
    border: '1px solid #2d3148',
    background: '#1e2130',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  },
  actionBtnCopied: {
    color: '#4ade80',
    borderColor: '#4ade8040',
  },
  codeBlock: {
    padding: '20px 24px',
    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
    fontSize: '12.5px',
    lineHeight: '1.75',
    color: '#cbd5e1',
    overflowX: 'auto',
    maxHeight: '520px',
    overflowY: 'auto',
    whiteSpace: 'pre',
    tabSize: 2,
  },
  errorBox: {
    background: '#2d1515',
    border: '1px solid #f8717140',
    borderRadius: '10px',
    padding: '20px',
    color: '#f87171',
    fontSize: '13px',
  },
  loading: {
    textAlign: 'center',
    padding: '80px 24px',
    color: '#475569',
    fontSize: '14px',
  },
  downloadAll: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #6366f150',
    background: 'transparent',
    color: '#a5b4fc',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
}

function highlight(content) {
  // 간단한 HCL 구문 강조 (color만 적용)
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 문자열
    .replace(/"([^"]*)"/g, '<span style="color:#86efac">"$1"</span>')
    // 키워드
    .replace(/\b(resource|provider|variable|output|data|locals|terraform|required_providers|depends_on|module)\b/g,
      '<span style="color:#818cf8">$1</span>')
    // 속성값 키
    .replace(/\b(source|version|type|default|description|value|sensitive|most_recent|owners|filter)\b(\s*=)/g,
      '<span style="color:#7dd3fc">$1</span>$2')
    // 블록 타입
    .replace(/\b(ingress|egress|tags|filter|lifecycle)\b(\s*\{)/g,
      '<span style="color:#c084fc">$1</span>$2')
    // 변수 참조
    .replace(/\$\{([^}]+)\}/g, '<span style="color:#fbbf24">${$1}</span>')
    // 주석
    .replace(/(#[^\n]*)/g, '<span style="color:#475569">$1</span>')
}

function FilePanel({ file }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleDownload = () => {
    const blob = new Blob([file.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={styles.codePanel}>
      <div style={styles.codePanelHeader}>
        <span style={styles.fileName}>{file.name}</span>
        <div style={styles.btnRow}>
          <button
            style={{ ...styles.actionBtn, ...(copied ? styles.actionBtnCopied : {}) }}
            onClick={handleCopy}
          >
            {copied ? '✓ 복사됨' : '복사'}
          </button>
          <button style={styles.actionBtn} onClick={handleDownload}>
            다운로드
          </button>
        </div>
      </div>
      <div
        style={styles.codeBlock}
        dangerouslySetInnerHTML={{ __html: highlight(file.content) }}
      />
    </div>
  )
}

export default function TerraformPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTerraformFiles(jobId)
      .then((res) => setFiles(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Terraform 파일을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [jobId])

  const handleDownloadAll = () => {
    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  if (loading) return <div style={styles.loading}>파일 불러오는 중...</div>

  return (
    <div style={styles.page}>
      <TopBar />
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>← 뒤로</button>
          <div style={styles.titleWrap}>
            <h1 style={styles.title}>Terraform 코드</h1>
            <p style={styles.subtitle}>이 배포에 사용된 인프라 코드입니다</p>
          </div>
        </div>
        {files.length > 0 && (
          <button style={styles.downloadAll} onClick={handleDownloadAll}>
            전체 다운로드
          </button>
        )}
      </div>

      <div style={styles.infoBanner}>
        <span style={styles.infoIcon}>ℹ️</span>
        <span>
          이 코드로 동일한 인프라를 직접 배포할 수 있습니다.
          <strong style={{ color: '#e2e8f0' }}> terraform.tfvars.json</strong>에 AWS 자격증명을 입력 후
          {' '}<code style={{ background: '#1e2535', padding: '1px 6px', borderRadius: '4px', fontSize: '12px' }}>terraform init &amp;&amp; terraform apply</code>로 실행하세요.
          자격증명 파일은 보안상 제공되지 않습니다.
        </span>
      </div>

      {error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : (
        <>
          <div style={styles.tabs}>
            {files.map((file, i) => (
              <button
                key={file.name}
                style={{ ...styles.tab, ...(activeTab === i ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(i)}
              >
                {file.name}
              </button>
            ))}
          </div>
          {files[activeTab] && <FilePanel file={files[activeTab]} />}
        </>
      )}

      <DeployWorkflow />
    </div>
  )
}
