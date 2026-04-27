import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDeployStatus, cancelDeploy, subscribeDeployStream } from '../api/deploy'
import StatusBadge from '../components/StatusBadge'
import TopBar from '../components/TopBar'

const styles = {
  page: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  backBtn: {
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '8px 14px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  card: {
    background: '#151823',
    border: '1px solid #1e2535',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #1a1f30',
    fontSize: '14px',
  },
  rowLabel: { color: '#64748b' },
  rowValue: { color: '#e2e8f0', fontWeight: '500' },
  ip: {
    fontFamily: 'ui-monospace, monospace',
    color: '#38bdf8',
    fontSize: '15px',
  },
  // 로그 콘솔
  logBox: {
    background: '#0d1017',
    border: '1px solid #1e2535',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '20px',
    maxHeight: '260px',
    overflowY: 'auto',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '12px',
  },
  logTitle: {
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  logLine: {
    color: '#94a3b8',
    lineHeight: '1.8',
    borderBottom: '1px solid #ffffff08',
    padding: '2px 0',
  },
  logLineDone: { color: '#4ade80' },
  logLineError: { color: '#f87171' },
  logLineCurrent: { color: '#38bdf8', fontWeight: '600' },
  successBox: {
    background: '#052e16',
    border: '1px solid #4ade8040',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
  },
  successTitle: {
    color: '#4ade80',
    fontWeight: '600',
    marginBottom: '12px',
    fontSize: '15px',
  },
  successItem: { color: '#86efac', fontSize: '13px', marginBottom: '6px' },
  pemWarning: {
    background: '#2d1a00',
    border: '2px solid #fb923c',
    borderRadius: '10px',
    padding: '20px 24px',
    marginTop: '16px',
  },
  pemWarningTitle: {
    color: '#fb923c',
    fontWeight: '700',
    fontSize: '15px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pemWarningDesc: {
    color: '#fdba74',
    fontSize: '13px',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  pemDownloadBtn: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#fb923c',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  errorBox: {
    background: '#2d1515',
    border: '1px solid #f8717140',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
  },
  errorText: {
    color: '#f87171',
    fontSize: '13px',
    fontFamily: 'ui-monospace, monospace',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #38bdf840',
    borderTop: '2px solid #38bdf8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
    verticalAlign: 'middle',
  },
  retryBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #2d3148',
    background: '#1e2130',
    color: '#e2e8f0',
    fontSize: '13px',
    cursor: 'pointer',
  },
}

function getLogLineStyle(line) {
  if (line.includes('✓') || line.includes('완료')) return styles.logLineDone
  if (line.includes('오류') || line.includes('실패')) return styles.logLineError
  return styles.logLine
}

export default function StatusPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [sshKey, setSshKey] = useState(null)
  const logEndRef = useRef(null)

  // 로그 추가 헬퍼
  const addLog = (msg) => setLogs((prev) => [...prev, msg])

  // 로그 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    // SSE 구독
    const es = subscribeDeployStream(jobId, {
      onStatus: (data) => setJob(data),
      onStep: (step) => {
        addLog(step)
        setJob((prev) => prev ? { ...prev, currentStep: step } : prev)
      },
      onComplete: (data) => {
        setJob(data)
        if (data.status === 'SUCCESS') {
          addLog('✓ 배포 완료!')
          if (data.sshPrivateKey) setSshKey(data.sshPrivateKey)
        } else if (data.status === 'FAILED') {
          addLog(`오류: ${data.errorMessage || '배포 실패'}`)
        }
      },
      onError: () => {
        // SSE 연결 실패 시 한 번만 폴링으로 상태 조회
        getDeployStatus(jobId)
          .then((res) => setJob(res.data))
          .catch(() => setError('상태 조회에 실패했습니다.'))
      },
    })

    return () => es.close()
  }, [jobId])

  const handleCancel = async () => {
    if (!window.confirm('배포를 취소하면 생성 중인 모든 AWS 리소스가 삭제됩니다. 계속하시겠습니까?')) return
    setCancelling(true)
    try {
      await cancelDeploy(jobId)
      // 취소 요청 성공 → SSE complete 이벤트로 CANCELLED 상태가 도착함
    } catch (err) {
      setError(err.response?.data?.message || '취소에 실패했습니다.')
      setCancelling(false)
    }
  }

  if (error) return (
    <div style={styles.page}>
      <div style={styles.errorBox}><p style={styles.errorText}>{error}</p></div>
      <button style={styles.retryBtn} onClick={() => navigate('/')}>돌아가기</button>
    </div>
  )

  if (!job) return (
    <div style={{ ...styles.page, textAlign: 'center', paddingTop: '80px', color: '#64748b' }}>
      불러오는 중...
    </div>
  )

  return (
    <div style={styles.page}>
      <TopBar />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← 돌아가기</button>
        <h1 style={styles.title}>배포 상태</h1>
      </div>

      {/* 기본 정보 카드 */}
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.rowLabel}>상태</span>
          <StatusBadge status={job.status} />
        </div>
        {job.publicIp && (
          <div style={styles.row}>
            <span style={styles.rowLabel}>퍼블릭 IP</span>
            <span style={{ ...styles.rowValue, ...styles.ip }}>{job.publicIp}</span>
          </div>
        )}
        {job.instanceId && (
          <div style={styles.row}>
            <span style={styles.rowLabel}>Instance ID</span>
            <span style={{ ...styles.rowValue, fontFamily: 'ui-monospace, monospace', fontSize: '13px' }}>
              {job.instanceId}
            </span>
          </div>
        )}
        <div style={{ ...styles.row, borderBottom: 'none' }}>
          <span style={styles.rowLabel}>시작 시간</span>
          <span style={styles.rowValue}>{new Date(job.createdAt).toLocaleString('ko-KR')}</span>
        </div>
      </div>

      {/* Terraform 로그 콘솔 */}
      {logs.length > 0 && (
        <div style={styles.logBox}>
          <div style={styles.logTitle}>배포 로그</div>
          {logs.map((line, i) => (
            <div
              key={i}
              style={i === logs.length - 1 && job.status === 'RUNNING'
                ? styles.logLineCurrent
                : getLogLineStyle(line)}
            >
              {line}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}

      {/* RUNNING 상태 */}
      {job.status === 'RUNNING' && (
        <div style={{ textAlign: 'center', color: '#38bdf8', fontSize: '14px', padding: '16px' }}>
          <span style={styles.spinner} />
          {job.currentStep || '배포 진행 중...'}
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>
            전체 약 3~5분 소요됩니다.
          </div>
          <button
            style={{ ...styles.retryBtn, marginTop: '16px', color: '#f87171', borderColor: '#f8717140' }}
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? '취소 중...' : '배포 취소 (terraform destroy)'}
          </button>
        </div>
      )}

      {/* SUCCESS 상태 */}
      {job.status === 'SUCCESS' && (
        <div style={styles.successBox}>
          <p style={styles.successTitle}>배포 완료!</p>
          <p style={styles.successItem}>✓ EC2 인스턴스 생성 완료 (Terraform)</p>
          <p style={styles.successItem}>✓ EIP 할당 및 연결 완료</p>
          <p style={styles.successItem}>✓ 보안그룹 설정 완료</p>
          <p style={styles.successItem}>✓ GitHub Actions CD 파이프라인 설정 완료</p>
          {job.publicIp && (
            <p style={{ ...styles.successItem, marginTop: '12px', color: '#4ade80' }}>
              접속 URL: <a href={`http://${job.publicIp}`} target="_blank" rel="noreferrer"
                style={{ color: '#38bdf8' }}>http://{job.publicIp}</a>
            </p>
          )}

          {/* PEM 키 다운로드 — 이 창을 닫으면 다시 받을 수 없음 */}
          {sshKey && (
            <div style={styles.pemWarning}>
              <p style={styles.pemWarningTitle}>
                ⚠️ SSH 프라이빗 키를 지금 저장하세요!
              </p>
              <p style={styles.pemWarningDesc}>
                이 키는 보안상 서버에 저장되지 않으며, <strong>지금이 유일한 다운로드 기회</strong>입니다.<br />
                <br />
                <strong>꼭 저장해야 하는 이유</strong><br />
                · <strong>서버 직접 접속 (SSH 인증)</strong> — EC2는 비밀번호 로그인이 기본 차단되어 있어, 이 .pem 키가 유일한 인증 수단입니다. 로그 확인·장애 대응·수동 작업 시 <code>ssh -i key.pem ubuntu@{'<'}서버IP{'>'}</code>로 접속합니다.<br />
                · <strong>GitHub Actions CD 재설정</strong> — 현재 배포에는 SSH 키가 Secrets에 자동 등록되어 CD가 동작하지만, 레포를 새로 연결하거나 Secrets를 재설정할 때 이 키가 반드시 필요합니다.
              </p>
              <button
                style={styles.pemDownloadBtn}
                onClick={() => {
                  const blob = new Blob([sshKey], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `easydeploy-${job.jobId}.pem`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                ↓ easydeploy-{job.jobId}.pem 다운로드
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button style={styles.retryBtn} onClick={() => navigate(`/terraform/${job.jobId}`)}>Terraform 코드 보기</button>
            <button style={styles.retryBtn} onClick={() => navigate('/servers')}>내 서버 보기</button>
            <button style={styles.retryBtn} onClick={() => navigate('/')}>홈으로</button>
          </div>
        </div>
      )}

      {/* FAILED 상태 */}
      {job.status === 'FAILED' && (
        <div style={styles.errorBox}>
          <p style={{ color: '#f87171', fontWeight: '600', marginBottom: '8px' }}>배포 실패</p>
          <p style={styles.errorText}>{job.errorMessage}</p>
          <p style={{ ...styles.errorText, marginTop: '8px', color: '#64748b' }}>
            Terraform이 자동으로 생성된 모든 리소스를 롤백했습니다.
          </p>
          <button style={styles.retryBtn} onClick={() => navigate('/deploy')}>다시 시도</button>
        </div>
      )}

      {/* CANCELLED 상태 */}
      {job.status === 'CANCELLED' && (
        <div style={{
          background: '#1c1008',
          border: '1px solid #fb923c40',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '20px',
        }}>
          <p style={{ color: '#fb923c', fontWeight: '600', marginBottom: '8px' }}>배포 취소됨</p>
          <p style={{ color: '#fdba74', fontSize: '13px', marginBottom: '4px' }}>
            Terraform이 생성 중이던 모든 AWS 리소스를 삭제했습니다.
          </p>
          <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
            추가 비용이 발생하지 않습니다.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={styles.retryBtn} onClick={() => navigate('/deploy')}>새로 배포하기</button>
            <button style={styles.retryBtn} onClick={() => navigate('/')}>홈으로</button>
          </div>
        </div>
      )}
    </div>
  )
}
