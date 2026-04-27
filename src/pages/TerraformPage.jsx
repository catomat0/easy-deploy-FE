import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTerraformFiles } from '../api/deploy'
import TopBar from '../components/TopBar'

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
    </div>
  )
}
