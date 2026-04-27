import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import TopBar from '../components/TopBar'
import { startDeploy, listVpcs, listSubnets } from '../api/deploy'

const INITIAL_FORM = {
  awsAccessKeyId: '',
  awsSecretAccessKey: '',
  awsRegion: 'ap-northeast-2',
  instanceType: 't3.small',
  storageSize: 20,
  vpcId: '',
  subnetId: '',
  githubRepoUrl: '',
  githubToken: '',
  envProd: '',
}

const INSTANCE_TYPES = [
  { value: 't3.micro',  label: 't3.micro  — 1GB  ⚠️ 앱 단독도 빌드 중 OOM 위험' },
  { value: 't3.small',  label: 't3.small  — 2GB  ✅ 앱 단독 권장 (기본값)' },
  { value: 't3.medium', label: 't3.medium — 4GB  ✅ Redis + DB 함께 올릴 때 권장' },
  { value: 't3.large',  label: 't3.large  — 8GB  ✅ 고사양 필요 시' },
  { value: 't2.micro',  label: 't2.micro  — 1GB  ⚠️ 앱 단독도 빌드 중 OOM 위험' },
]

const STORAGE_SIZES = [
  { value: 8,  label: '8 GiB  ⚠️ 최소 — Docker 이미지 빌드 후 공간 부족 위험' },
  { value: 20, label: '20 GiB  ✅ 기본값 권장 — 앱 단독 운용에 충분' },
  { value: 30, label: '30 GiB  ✅ Redis · DB 함께 올릴 때 권장' },
  { value: 50, label: '50 GiB  — 대용량 데이터·로그 보관 필요 시' },
]

const styles = {
  page: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  card: {
    background: '#151823',
    border: '1px solid #1e2535',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#7c85a8',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #1e2535',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  select: {
    width: '100%',
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  fetchBtn: {
    padding: '9px 18px',
    borderRadius: '8px',
    border: '1px solid #6366f150',
    background: 'transparent',
    color: '#a5b4fc',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  selectLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: '6px',
    display: 'block',
  },
  selectHint: {
    fontSize: '11px',
    color: '#475569',
    marginTop: '4px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },
  error: {
    background: '#2d1515',
    border: '1px solid #f8717140',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '16px',
  },
  validationBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: '#2d1515',
    border: '1px solid #f87171',
    borderRadius: '10px',
    padding: '14px 18px',
    marginBottom: '20px',
    color: '#f87171',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  dockerNotice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 18px',
    background: '#1a1200',
    border: '1px solid #f59e0b40',
    borderRadius: '10px',
    marginBottom: '24px',
    fontSize: '13px',
    color: '#fbbf24',
    lineHeight: '1.6',
  },
}

function validate(form) {
  const errors = {}
  if (!form.awsAccessKeyId.trim())
    errors.awsAccessKeyId = 'Access Key ID를 입력하세요.'
  else if (!/^AKIA[A-Z0-9]{16}$/.test(form.awsAccessKeyId.trim()))
    errors.awsAccessKeyId = 'AKIA로 시작하는 20자리 키를 입력하세요.'

  if (!form.awsSecretAccessKey.trim())
    errors.awsSecretAccessKey = 'Secret Access Key를 입력하세요.'
  else if (form.awsSecretAccessKey.trim().length < 20)
    errors.awsSecretAccessKey = '올바른 Secret Access Key를 입력하세요.'

  if (!form.githubRepoUrl.trim())
    errors.githubRepoUrl = '레포지토리 URL을 입력하세요.'
  else if (!/^https:\/\/github\.com\/.+\/.+/.test(form.githubRepoUrl.trim()))
    errors.githubRepoUrl = 'https://github.com/유저명/레포 형식으로 입력하세요.'

  if (!form.githubToken.trim())
    errors.githubToken = 'GitHub Token을 입력하세요.'
  else if (!form.githubToken.trim().startsWith('ghp_') && !form.githubToken.trim().startsWith('github_pat_'))
    errors.githubToken = 'ghp_ 또는 github_pat_ 로 시작하는 토큰을 입력하세요.'

  if (!form.envProd.trim())
    errors.envProd = '프로덕션 환경변수를 입력하세요.'

  return errors
}

const FIELD_LABELS = {
  awsAccessKeyId: 'Access Key ID',
  awsSecretAccessKey: 'Secret Access Key',
  githubRepoUrl: '레포지토리 URL',
  githubToken: 'GitHub Token',
  envProd: '.env.prod',
}

export default function DeployPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showValidationBanner, setShowValidationBanner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // VPC / Subnet 드롭다운 상태
  const [vpcs, setVpcs] = useState([])
  const [subnets, setSubnets] = useState([])
  const [vpcLoading, setVpcLoading] = useState(false)
  const [subnetLoading, setSubnetLoading] = useState(false)
  const [vpcError, setVpcError] = useState('')

  const canFetchVpcs = form.awsAccessKeyId.trim() && form.awsSecretAccessKey.trim() && form.awsRegion

  const handleFetchVpcs = async () => {
    setVpcLoading(true)
    setVpcError('')
    setVpcs([])
    setSubnets([])
    setForm(prev => ({ ...prev, vpcId: '', subnetId: '' }))
    try {
      const res = await listVpcs({
        awsAccessKeyId: form.awsAccessKeyId,
        awsSecretAccessKey: form.awsSecretAccessKey,
        awsRegion: form.awsRegion,
      })
      setVpcs(res.data)
    } catch {
      setVpcError('VPC 조회에 실패했습니다. 자격증명과 리전을 확인하세요.')
    } finally {
      setVpcLoading(false)
    }
  }

  const handleVpcChange = async (e) => {
    const vpcId = e.target.value
    setForm(prev => ({ ...prev, vpcId, subnetId: '' }))
    setSubnets([])
    if (!vpcId) return
    setSubnetLoading(true)
    try {
      const res = await listSubnets({
        awsAccessKeyId: form.awsAccessKeyId,
        awsSecretAccessKey: form.awsSecretAccessKey,
        awsRegion: form.awsRegion,
        vpcId,
      })
      setSubnets(res.data)
    } catch {
      setVpcError('서브넷 조회에 실패했습니다.')
    } finally {
      setSubnetLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      const updated = { ...fieldErrors, [name]: '' }
      setFieldErrors(updated)
      setShowValidationBanner(Object.values(updated).some(v => !!v))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setShowValidationBanner(true)
      // 첫 번째 에러 필드로 스크롤
      const firstErrorKey = Object.keys(errors)[0]
      const el = document.querySelector(`[name="${firstErrorKey}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setShowValidationBanner(false)
    setFieldErrors({})
    setLoading(true)
    try {
      const res = await startDeploy(form)
      navigate(`/status/${res.data.jobId}`)
    } catch (err) {
      setError(err.response?.data?.message || '배포 요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <TopBar />
      <div style={styles.header}>
        <h1 style={styles.title}>서버 배포</h1>
        <p style={styles.subtitle}>정보를 입력하면 EC2 서버 생성부터 CD 파이프라인 설정까지 자동으로 처리합니다.</p>
      </div>

      <div style={styles.dockerNotice}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>🐳</span>
        <span>
          <strong>CD 배포는 Docker를 전제로 합니다.</strong>{' '}
          자동 생성되는 GitHub Actions 워크플로우는 <code style={{ background: '#2a1f00', padding: '1px 5px', borderRadius: '3px' }}>docker-compose.yml</code> 기반으로 동작합니다.
          레포지토리 루트에 <code style={{ background: '#2a1f00', padding: '1px 5px', borderRadius: '3px' }}>Dockerfile</code>과 <code style={{ background: '#2a1f00', padding: '1px 5px', borderRadius: '3px' }}>docker-compose.yml</code>이 있어야 합니다.
        </span>
      </div>

      {showValidationBanner && (
        <div style={styles.validationBanner}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
          <div>
            <strong>필수 항목을 모두 입력해주세요.</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: '16px' }}>
              {Object.entries(fieldErrors).filter(([, v]) => !!v).map(([key, msg]) => (
                <li key={key}>{FIELD_LABELS[key] ?? key}: {msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* AWS 설정 */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>AWS 설정</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.grid}>
              <FormField label="Access Key ID" name="awsAccessKeyId" placeholder="AKIA..." required value={form.awsAccessKeyId} onChange={handleChange} error={fieldErrors.awsAccessKeyId} />
              <FormField label="Secret Access Key" name="awsSecretAccessKey" type="password" placeholder="••••••••" required value={form.awsSecretAccessKey} onChange={handleChange} error={fieldErrors.awsSecretAccessKey} />
            </div>
            <div style={styles.grid}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8' }}>
                  인스턴스 타입 <span style={{ color: '#f87171' }}>*</span>
                </label>
                <select name="instanceType" value={form.instanceType} onChange={handleChange} style={styles.select}>
                  {INSTANCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8' }}>
                  스토리지 크기 <span style={{ color: '#f87171' }}>*</span>
                </label>
                <select
                  name="storageSize"
                  value={form.storageSize}
                  onChange={e => setForm(prev => ({ ...prev, storageSize: Number(e.target.value) }))}
                  style={styles.select}
                >
                  {STORAGE_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* VPC / Subnet 선택 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#7c85a8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  네트워크 설정
                </span>
                <button
                  type="button"
                  style={{
                    ...styles.fetchBtn,
                    opacity: canFetchVpcs ? 1 : 0.4,
                    cursor: canFetchVpcs ? 'pointer' : 'not-allowed',
                  }}
                  onClick={handleFetchVpcs}
                  disabled={!canFetchVpcs || vpcLoading}
                >
                  {vpcLoading ? '조회 중...' : 'VPC 불러오기'}
                </button>
              </div>

              {vpcError && (
                <div style={{ fontSize: '12px', color: '#f87171', padding: '8px 12px', background: '#2d151520', borderRadius: '6px', border: '1px solid #f8717130' }}>
                  {vpcError}
                </div>
              )}

              {vpcs.length > 0 && (
                <div style={styles.grid}>
                  {/* VPC 드롭다운 */}
                  <div>
                    <label style={styles.selectLabel}>VPC</label>
                    <select
                      value={form.vpcId}
                      onChange={handleVpcChange}
                      style={styles.select}
                    >
                      <option value="">기본 VPC 사용</option>
                      {vpcs.map(v => (
                        <option key={v.vpcId} value={v.vpcId}>
                          {v.name ? `${v.name} (${v.vpcId})` : v.vpcId} — {v.cidr}
                          {v.isDefault === 'true' ? ' [기본]' : ''}
                        </option>
                      ))}
                    </select>
                    <div style={styles.selectHint}>선택 안 하면 계정 기본 VPC 사용</div>
                  </div>

                  {/* Subnet 드롭다운 */}
                  <div>
                    <label style={styles.selectLabel}>서브넷</label>
                    <select
                      value={form.subnetId}
                      onChange={(e) => setForm(prev => ({ ...prev, subnetId: e.target.value }))}
                      style={{
                        ...styles.select,
                        opacity: (!form.vpcId || subnetLoading) ? 0.5 : 1,
                      }}
                      disabled={!form.vpcId || subnetLoading}
                    >
                      <option value="">
                        {subnetLoading ? '조회 중...' : form.vpcId ? '서브넷 선택 (선택 안 하면 자동)' : 'VPC 먼저 선택하세요'}
                      </option>
                      {subnets.map(s => (
                        <option key={s.subnetId} value={s.subnetId}>
                          {s.name ? `${s.name} — ` : ''}{s.subnetId} ({s.az}) {s.cidr}
                        </option>
                      ))}
                    </select>
                    <div style={styles.selectHint}>선택 안 하면 AWS가 서브넷 자동 선택</div>
                  </div>
                </div>
              )}

              <div style={{
                fontSize: '12px', color: '#64748b', lineHeight: '1.7',
                background: '#0d1120', border: '1px solid #1e2535',
                borderRadius: '8px', padding: '10px 14px',
              }}>
                <strong style={{ color: '#7c85a8' }}>💡 VPC란?</strong>{' '}
                AWS 계정 내에 만들어진 <strong style={{ color: '#94a3b8' }}>가상 네트워크</strong>예요. EC2 인스턴스는 반드시 하나의 VPC 안에 위치해야 해요.
                대부분의 경우 <strong style={{ color: '#94a3b8' }}>기본 VPC(Default VPC)</strong>를 그대로 사용하면 충분합니다.
                특정 VPC·서브넷에 배포해야 하는 경우에만 선택하세요.
              </div>

              {vpcs.length === 0 && !vpcLoading && (
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  자격증명 입력 후 "VPC 불러오기"를 클릭하세요. 건너뛰면 계정 기본 VPC를 사용합니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub 설정 */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>GitHub 설정</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="레포지토리 URL" name="githubRepoUrl" placeholder="https://github.com/user/repo" required value={form.githubRepoUrl} onChange={handleChange} error={fieldErrors.githubRepoUrl} />
            <FormField label="GitHub Token" name="githubToken" type="password" placeholder="ghp_..." required hint="repo + secrets 권한이 필요합니다." value={form.githubToken} onChange={handleChange} error={fieldErrors.githubToken} />
            <FormField label=".env.prod" name="envProd" type="textarea" placeholder={"DATABASE_URL=...\nPORT=3000\n..."} required hint="프로덕션 환경변수를 입력하세요." value={form.envProd} onChange={handleChange} error={fieldErrors.envProd} />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
          {loading ? '배포 요청 중...' : '배포 시작'}
        </button>
      </form>
    </div>
  )
}
