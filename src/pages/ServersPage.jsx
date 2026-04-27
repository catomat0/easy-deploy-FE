import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyServers, terminateServer } from '../api/deploy'
import StatusBadge from '../components/StatusBadge'
import TopBar from '../components/TopBar'



const styles = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  deployBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  backBtn: {
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '8px 14px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
    marginRight: '12px',
  },
  card: {
    background: '#151823',
    border: '1px solid #1e2535',
    borderRadius: '12px',
    padding: '24px 28px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
  },
  cardRight: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
  },
  repoUrl: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 20px',
    fontSize: '12px',
    color: '#64748b',
  },
  metaItem: {
    display: 'flex',
    gap: '6px',
  },
  metaLabel: { color: '#475569' },
  metaValue: { color: '#94a3b8', fontFamily: 'ui-monospace, monospace' },
  ip: {
    fontFamily: 'ui-monospace, monospace',
    color: '#38bdf8',
    fontSize: '14px',
    fontWeight: '600',
  },
  terminateBtn: {
    padding: '7px 16px',
    borderRadius: '7px',
    border: '1px solid #f8717140',
    background: 'transparent',
    color: '#f87171',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  actionBtn: {
    padding: '7px 16px',
    borderRadius: '7px',
    border: '1px solid #2d3148',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  openBtn: {
    padding: '7px 16px',
    borderRadius: '7px',
    border: '1px solid #38bdf840',
    background: 'transparent',
    color: '#38bdf8',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
    color: '#475569',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  },
  errorBox: {
    background: '#2d1515',
    border: '1px solid #f8717140',
    borderRadius: '10px',
    padding: '16px 20px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '20px',
  },
  divider: {
    borderBottom: '1px solid #1a1f30',
    margin: '4px 0 16px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#475569',
    marginBottom: '12px',
  },
}

const tfBtnStyle = { color: '#818cf8', borderColor: '#6366f140' }

function ServerCard({ server, onTerminate }) {
  const navigate = useNavigate()
  const [terminating, setTerminating] = useState(false)
  const isRunning = server.status === 'RUNNING'

  const handleTerminate = async () => {
    if (!window.confirm(
      `서버를 종료하면 EC2 인스턴스와 EIP가 모두 삭제됩니다.\n${server.publicIp} (${server.instanceId})\n\n계속하시겠습니까?`
    )) return
    setTerminating(true)
    try {
      await onTerminate(server.id)
    } finally {
      setTerminating(false)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardLeft}>
        <div style={styles.repoUrl}>
          {server.githubRepoUrl.replace('https://github.com/', '')}
        </div>
        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Instance</span>
            <span style={styles.metaValue}>{server.instanceId}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Type</span>
            <span style={styles.metaValue}>{server.instanceType}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Region</span>
            <span style={styles.metaValue}>{server.awsRegion}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>생성</span>
            <span style={styles.metaValue}>
              {new Date(server.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.cardRight}>
        <StatusBadge status={server.status} />
        {server.publicIp && (
          <span style={styles.ip}>{server.publicIp}</span>
        )}
        {isRunning && server.publicIp && (
          <a
            href={`http://${server.publicIp}`}
            target="_blank"
            rel="noreferrer"
            style={styles.openBtn}
          >
            접속
          </a>
        )}
        {server.deployJobUuid && (
          <button
            style={{ ...styles.actionBtn, ...tfBtnStyle }}
            onClick={() => navigate(`/terraform/${server.deployJobUuid}`)}
          >
            Terraform 코드
          </button>
        )}
        {isRunning && (
          <button
            style={styles.terminateBtn}
            onClick={handleTerminate}
            disabled={terminating}
          >
            {terminating ? '종료 중...' : '서버 종료'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function ServersPage() {
  const navigate = useNavigate()
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyServers()
      .then((res) => setServers(res.data))
      .catch(() => setError('서버 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const handleTerminate = async (serverId) => {
    await terminateServer(serverId)
    setServers((prev) =>
      prev.map((s) => s.id === serverId ? { ...s, status: 'TERMINATED' } : s)
    )
  }

  const running = servers.filter((s) => s.status === 'RUNNING')
  const terminated = servers.filter((s) => s.status !== 'RUNNING')

  return (
    <div style={styles.page}>
      <TopBar />
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={styles.title}>내 서버</h1>
        </div>
        <button style={styles.deployBtn} onClick={() => navigate('/deploy')}>
          + 새 서버 배포
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={{ ...styles.empty, paddingTop: '60px' }}>
          <p style={{ color: '#475569' }}>불러오는 중...</p>
        </div>
      ) : servers.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>배포된 서버가 없습니다</p>
          <p style={{ marginBottom: '24px', fontSize: '14px' }}>첫 번째 서버를 배포해보세요.</p>
          <button style={styles.deployBtn} onClick={() => navigate('/deploy')}>
            지금 배포하기
          </button>
        </div>
      ) : (
        <>
          {running.length > 0 && (
            <section>
              <p style={styles.sectionLabel}>운영 중 ({running.length})</p>
              {running.map((s) => (
                <ServerCard key={s.id} server={s} onTerminate={handleTerminate} />
              ))}
            </section>
          )}

          {terminated.length > 0 && (
            <section style={{ marginTop: running.length > 0 ? '32px' : 0 }}>
              <p style={styles.sectionLabel}>종료 이력 ({terminated.length})</p>
              {terminated.map((s) => (
                <ServerCard key={s.id} server={s} onTerminate={handleTerminate} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
