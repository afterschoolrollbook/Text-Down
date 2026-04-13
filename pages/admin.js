import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const S = {
  page: { minHeight: '100vh', background: '#0c0c0c', fontFamily: "'Outfit', sans-serif", color: '#f0f0f0', padding: '0 0 60px' },
  wrap: { maxWidth: 820, margin: '0 auto', padding: '0 20px' },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28, marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 },
  row: { background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 18px', marginBottom: 8 },
  code: { color: '#ff8888', fontFamily: 'monospace', fontSize: 13 },
  label: { color: '#888', fontSize: 13, marginTop: 3 },
  example: { color: '#555', fontSize: 12, fontFamily: 'monospace' },
  input: { background: '#1f1f1f', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#f0f0f0', fontFamily: "'Outfit', sans-serif", fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: (color = '#e63946') => ({ background: color, color: '#fff', border: 'none', borderRadius: 9, padding: '11px 28px', fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer' }),
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 50, height: 28, borderRadius: 14, background: value ? '#e63946' : '#333', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', position: 'absolute', top: 3, left: value ? 25 : 3, transition: 'left 0.2s' }} />
    </div>
  )
}

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/settings/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
      const data = await res.json()
      if (!res.ok) { setErr(data.error || '비밀번호가 틀렸습니다'); setTimeout(() => setErr(''), 2500) }
      else { sessionStorage.setItem('admin_token', data.token); onLogin(data.token) }
    } catch { setErr('서버 연결 실패') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14, padding: 40, width: 360 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, background: '#e63946', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, marginBottom: 16, color: '#fff' }}>T</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f0f0f0' }}>Admin</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Text-Down 관리자 패널</p>
        </div>
        <form onSubmit={submit}>
          <input type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} style={{ ...S.input, borderColor: err ? '#e63946' : '#333', marginBottom: 8 }} />
          {err && <p style={{ color: '#e63946', fontSize: 13, marginBottom: 8 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ ...S.btn(), width: '100%', marginTop: 8, opacity: loading ? 0.6 : 1 }}>{loading ? '확인 중...' : '로그인'}</button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [adsOn, setAdsOn] = useState(true)
  const [soundDownBanner, setSoundDownBanner] = useState(false)
  const [thumbDownBanner, setThumbDownBanner] = useState(false)
  const [saved, setSaved] = useState(false)
  const [blogTab, setBlogTab] = useState('write')
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogSaved, setBlogSaved] = useState(false)
  const [blogError, setBlogError] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [blogForm, setBlogForm] = useState({ slug: '', title_ko: '', title_en: '', content_ko: '', content_en: '', description_ko: '', description_en: '', tags: '', published: true })
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPwConfirm, setNewPwConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/get')
      if (!res.ok) return
      const data = await res.json()
      setAdsOn(data.adsOn ?? true)
      setSoundDownBanner(data.soundDownBanner ?? false)
      setThumbDownBanner(data.thumbDownBanner ?? false)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) { setAdminToken(token); setAuthed(true) } else { setLoading(false) }
    fetchSettings()
  }, [fetchSettings])

  const kvSave = async (body) => {
    const res = await fetch('/api/settings/save', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify(body) })
    if (!res.ok) throw new Error('저장 실패')
  }

  const handleSave = async () => {
    try { await kvSave({ adsOn, soundDownBanner, thumbDownBanner }); setSaved(true); setTimeout(() => setSaved(false), 2500) }
    catch { alert('저장 실패. 다시 시도해주세요.') }
  }

  const fetchBlogPosts = async () => {
    setBlogLoading(true)
    try {
      const res = await fetch('/api/blog/posts', { headers: { 'x-admin-token': adminToken } })
      const data = await res.json()
      setBlogPosts(Array.isArray(data) ? data : [])
    } catch {} finally { setBlogLoading(false) }
  }

  const handleTogglePublished = async (post) => {
    await fetch('/api/blog/posts', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ id: post.id, published: !post.published }) })
    fetchBlogPosts()
  }

  const handleBlogSubmit = async () => {
    if (!blogForm.slug || !blogForm.title_ko || !blogForm.content_ko) { setBlogError('슬러그, 제목(한국어), 내용(한국어)은 필수입니다.'); setTimeout(() => setBlogError(''), 3000); return }
    setBlogLoading(true)
    try {
      const body = { ...blogForm, tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
      const method = editingPost ? 'PUT' : 'POST'
      if (editingPost) body.id = editingPost.id
      const res = await fetch('/api/blog/posts', { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      setBlogSaved(true); setTimeout(() => setBlogSaved(false), 2500)
      setBlogForm({ slug: '', title_ko: '', title_en: '', content_ko: '', content_en: '', description_ko: '', description_en: '', tags: '', published: true })
      setEditingPost(null); fetchBlogPosts()
    } catch { setBlogError('저장 실패. 다시 시도해주세요.'); setTimeout(() => setBlogError(''), 3000) }
    finally { setBlogLoading(false) }
  }

  const handleBlogDelete = async (id) => {
    if (!confirm('삭제할까요?')) return
    await fetch('/api/blog/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ id }) })
    fetchBlogPosts()
  }

  const handleBlogEdit = (post) => {
    setEditingPost(post)
    setBlogForm({ slug: post.slug, title_ko: post.title_ko || '', title_en: post.title_en || '', content_ko: post.content_ko || '', content_en: post.content_en || '', description_ko: post.description_ko || '', description_en: post.description_en || '', tags: post.tags ? post.tags.join(', ') : '', published: post.published })
    setBlogTab('write')
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: '새 비밀번호는 6자 이상이어야 합니다.' }); setTimeout(() => setPwMsg(null), 3000); return }
    if (newPw !== newPwConfirm) { setPwMsg({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' }); setTimeout(() => setPwMsg(null), 3000); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/settings/password', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ newPassword: newPw }) })
      const data = await res.json()
      if (!res.ok) { setPwMsg({ type: 'error', text: data.error || '변경 실패' }) }
      else { setCurrentPw(''); setNewPw(''); setNewPwConfirm(''); setPwMsg({ type: 'success', text: '✅ 비밀번호가 변경되었습니다! 다음 로그인부터 새 비밀번호를 사용하세요.' }) }
      setTimeout(() => setPwMsg(null), 4000)
    } catch { setPwMsg({ type: 'error', text: '서버 오류. 다시 시도해주세요.' }) }
    finally { setPwLoading(false) }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: "'Outfit', sans-serif" }}>불러오는 중...</div>
  if (!authed) return <LoginScreen onLogin={(token) => { setAdminToken(token); setAuthed(true) }} />

  return (
    <>
      <Head>
        <title>Admin · Text-Down</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        <div style={{ borderBottom: '1px solid #1f1f1f', padding: '18px 0', marginBottom: 36 }}>
          <div style={{ ...S.wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>관리자 대시보드</h1>
              <p style={{ color: '#555', fontSize: 13, marginTop: 2 }}>Text-Down Admin Panel · Supabase 연동</p>
            </div>
            <a href="/" style={{ color: '#666', fontSize: 13, textDecoration: 'none' }}>← 사이트 보기</a>
          </div>
        </div>

        <div style={S.wrap}>

          {/* ===== 섹션 1: 애드센스 가이드 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>💰 애드센스 연동 가이드</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
              Vercel 대시보드 → 프로젝트 → Settings → Environment Variables 에서 아래 값을 추가하세요.
            </p>
            {[
              { key: 'NEXT_PUBLIC_ADSENSE_CLIENT', desc: '애드센스 게시자 ID', example: 'ca-pub-1234567890123456', important: true },
              { key: 'NEXT_PUBLIC_AD_SLOT_TOP', desc: '상단 배너 광고 슬롯 ID', example: '1111111111' },
              { key: 'NEXT_PUBLIC_AD_SLOT_LEFT', desc: '왼쪽 사이드바 광고 슬롯 ID', example: '5555555555' },
              { key: 'NEXT_PUBLIC_AD_SLOT_RIGHT', desc: '오른쪽 사이드바 광고 슬롯 ID', example: '6666666666' },
              { key: 'NEXT_PUBLIC_AD_SLOT_MIDDLE', desc: '중간 광고 슬롯 ID', example: '3333333333' },
              { key: 'NEXT_PUBLIC_AD_SLOT_FOOTER', desc: '하단 광고 슬롯 ID', example: '4444444444' },
              { key: 'NEXT_PUBLIC_ADMIN_PASSWORD', desc: '관리자 초기 비밀번호 (최초 1회)', example: '초기_비밀번호', important: true },
              { key: 'ADMIN_SECRET_TOKEN', desc: '서버 API 보안 토큰 (랜덤 문자열)', example: 'random_secret_32자_이상', important: true },
            ].map(({ key, desc, example, important }) => (
              <div key={key} style={{ ...S.row, borderColor: important ? '#3a2a2a' : '#2a2a2a', borderLeftColor: important ? '#e63946' : '#2a2a2a', borderLeftWidth: important ? 3 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div><span style={S.code}>{key}</span><p style={S.label}>{desc}</p></div>
                  <span style={S.example}>{example}</span>
                </div>
              </div>
            ))}
            <div style={{ background: '#0d1f0d', border: '1px solid #1a3a1a', borderRadius: 10, padding: 16, marginTop: 16 }}>
              <p style={{ color: '#5a9a5a', fontSize: 13, lineHeight: 1.7 }}>
                ✅ <strong>Supabase 연동 순서:</strong><br />
                1. Vercel 대시보드 → Integrations → Supabase 연결<br />
                2. 환경변수 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 자동 추가됨<br />
                3. ADMIN_SECRET_TOKEN에 랜덤 문자열 입력 후 Redeploy
              </p>
            </div>
          </div>

          {/* ===== 섹션 2: 수익화 전략 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>📊 수익화 전략</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { icon: '📍', title: '5개 광고 슬롯', color: '#1a1a2a', accent: '#4a6aff', desc: '상단/좌우 사이드바/중간/푸터에 배치. 페이지뷰당 최대 수익.' },
                { icon: '🌐', title: '한/영 이중 언어', color: '#1a2a1a', accent: '#4aaa6a', desc: '영어권 트래픽 확보. 영어권 CPC가 3~5배 높음.' },
                { icon: '📝', title: '블로그 SEO', color: '#2a2a1a', accent: '#aaaa4a', desc: '텍스트 도구 관련 블로그 글로 검색 유입 확대.' },
                { icon: '🔄', title: '반복 방문 유도', color: '#2a1a2a', accent: '#aa4aaa', desc: '유용한 도구로 북마크 유도. 재방문율이 수익 핵심.' },
              ].map(({ icon, title, desc, color, accent }) => (
                <div key={title} style={{ background: color, border: `1px solid ${accent}33`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: accent }}>{title}</div>
                  <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 섹션 3: 사이트 설정 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>⚙️ 사이트 설정</h2>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>광고 활성화</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{adsOn ? '광고가 표시됩니다' : '광고가 숨겨집니다'}</div>
                </div>
                <Toggle value={adsOn} onChange={setAdsOn} />
              </div>
            </div>
            <button onClick={handleSave} style={{ ...S.btn(saved ? '#2d7a2d' : '#e63946'), transition: 'background 0.3s' }}>
              {saved ? '✅ 저장 완료!' : '설정 저장'}
            </button>
          </div>

          {/* ===== 섹션 4: 블로그 글 관리 ===== */}
          <div style={S.card}>
            <h2 style={{ ...S.cardTitle, justifyContent: 'space-between' }}>
              <span>✍️ 블로그 글 관리</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setBlogTab('write'); setEditingPost(null); setBlogForm({ slug: '', title_ko: '', title_en: '', content_ko: '', content_en: '', description_ko: '', description_en: '', tags: '', published: true }) }} style={{ ...S.btn(blogTab === 'write' ? '#e63946' : '#2a2a2a'), padding: '7px 16px', fontSize: 13 }}>✏️ 글쓰기</button>
                <button onClick={() => { setBlogTab('list'); fetchBlogPosts() }} style={{ ...S.btn(blogTab === 'list' ? '#e63946' : '#2a2a2a'), padding: '7px 16px', fontSize: 13 }}>📋 글 목록</button>
              </div>
            </h2>
            {blogTab === 'write' && (
              <div>
                {editingPost && <div style={{ background: '#1a2a1a', border: '1px solid #2a4a2a', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#5a9a5a' }}>✏️ 수정 중: <strong>{editingPost.title_ko}</strong></div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>슬러그 * (URL: /blog/슬러그)</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} placeholder="how-to-count-characters" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>태그 (쉼표로 구분)</label>
                    <input value={blogForm.tags} onChange={e => setBlogForm(p => ({ ...p, tags: e.target.value }))} placeholder="텍스트, 글자수, 도구" style={S.input} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>제목 (한국어) *</label>
                    <input value={blogForm.title_ko} onChange={e => setBlogForm(p => ({ ...p, title_ko: e.target.value }))} placeholder="글자수 세는 방법" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>제목 (English)</label>
                    <input value={blogForm.title_en} onChange={e => setBlogForm(p => ({ ...p, title_en: e.target.value }))} placeholder="How to Count Characters" style={S.input} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>요약설명 (한국어) — SEO</label>
                    <input value={blogForm.description_ko} onChange={e => setBlogForm(p => ({ ...p, description_ko: e.target.value }))} placeholder="글자수를 빠르게 세는 방법" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>요약설명 (English)</label>
                    <input value={blogForm.description_en} onChange={e => setBlogForm(p => ({ ...p, description_en: e.target.value }))} placeholder="Learn how to count characters" style={S.input} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>본문 (한국어) * — HTML 가능: h2, p, ul, li, strong</label>
                  <textarea value={blogForm.content_ko} onChange={e => setBlogForm(p => ({ ...p, content_ko: e.target.value }))} placeholder={'<h2>글자수란?</h2>\n<p>글자수는...</p>'} style={{ ...S.input, height: 220, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>본문 (English)</label>
                  <textarea value={blogForm.content_en} onChange={e => setBlogForm(p => ({ ...p, content_en: e.target.value }))} placeholder={'<h2>What is character count?</h2>\n<p>A character is...</p>'} style={{ ...S.input, height: 220, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <Toggle value={blogForm.published} onChange={v => setBlogForm(p => ({ ...p, published: v }))} />
                  <span style={{ fontSize: 14, color: '#888' }}>{blogForm.published ? '공개' : '비공개'}</span>
                </div>
                {blogError && <p style={{ color: '#e63946', fontSize: 13, marginBottom: 10 }}>{blogError}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleBlogSubmit} disabled={blogLoading} style={{ ...S.btn(blogSaved ? '#2d7a2d' : '#e63946'), opacity: blogLoading ? 0.6 : 1, transition: 'background 0.3s' }}>{blogLoading ? '저장 중...' : blogSaved ? '✅ 저장 완료!' : editingPost ? '✏️ 수정 저장' : '📝 발행'}</button>
                  {editingPost && <button onClick={() => { setEditingPost(null); setBlogForm({ slug: '', title_ko: '', title_en: '', content_ko: '', content_en: '', description_ko: '', description_en: '', tags: '', published: true }) }} style={{ ...S.btn('#333'), fontSize: 14 }}>취소</button>}
                </div>
                <p style={{ color: '#555', fontSize: 12, marginTop: 10 }}>발행된 글: <a href="/blog" target="_blank" style={{ color: '#e63946' }}>/blog</a></p>
              </div>
            )}
            {blogTab === 'list' && (
              <div>
                {blogLoading && <p style={{ color: '#555', fontSize: 14 }}>불러오는 중...</p>}
                {!blogLoading && blogPosts.length === 0 && <p style={{ color: '#555', fontSize: 14 }}>아직 글이 없어요.</p>}
                {blogPosts.map(post => (
                  <div key={post.id} style={{ ...S.row, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{post.title_ko}</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: post.published ? '#1a3a1a' : '#3a1a1a', color: post.published ? '#4caf50' : '#e57373' }}>{post.published ? '공개' : '비공개'}</span>
                      </div>
                      <div style={{ color: '#555', fontSize: 12 }}>/blog/{post.slug} · {new Date(post.created_at).toLocaleDateString('ko-KR')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleTogglePublished(post)} style={{ ...S.btn(post.published ? '#3a2a00' : '#1a3a1a'), padding: '6px 12px', fontSize: 12 }}>{post.published ? '비공개로' : '공개로'}</button>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" style={{ ...S.btn('#2a2a5a'), padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}>보기</a>
                      <button onClick={() => handleBlogEdit(post)} style={{ ...S.btn('#2a4a2a'), padding: '6px 12px', fontSize: 12 }}>수정</button>
                      <button onClick={() => handleBlogDelete(post.id)} style={{ ...S.btn('#4a1a1a'), padding: '6px 12px', fontSize: 12 }}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== 섹션 5: 비밀번호 변경 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>🔒 비밀번호 변경</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
              변경된 비밀번호는 <strong style={{ color: '#aaa' }}>Supabase에 SHA-256 해시 저장</strong>되어 모든 기기에서 영구 적용됩니다.
            </p>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>현재 비밀번호</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="현재 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>새 비밀번호 (6자 이상)</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>새 비밀번호 확인</label>
                <input type="password" value={newPwConfirm} onChange={e => setNewPwConfirm(e.target.value)} placeholder="새 비밀번호 재입력" style={S.input} />
              </div>
              {pwMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13, background: pwMsg.type === 'success' ? '#0d1f0d' : '#2a1010', border: `1px solid ${pwMsg.type === 'success' ? '#1a4a1a' : '#4a1a1a'}`, color: pwMsg.type === 'success' ? '#5a9a5a' : '#e63946' }}>{pwMsg.text}</div>
              )}
              <button type="submit" disabled={pwLoading} style={{ ...S.btn('#3a5aff'), opacity: pwLoading ? 0.6 : 1 }}>{pwLoading ? '변경 중...' : '비밀번호 변경'}</button>
            </form>
          </div>

          {/* ===== 섹션 6: 배포 가이드 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>🚀 Vercel 배포 가이드</h2>
            {[
              { title: 'GitHub에 코드 업로드', desc: 'git add . → git commit → git push' },
              { title: 'Supabase 연결', desc: 'Vercel 대시보드 → Integrations → Supabase → 프로젝트 연결' },
              { title: '환경 변수 추가', desc: 'ADMIN_SECRET_TOKEN (랜덤 32자+) + NEXT_PUBLIC_ADMIN_PASSWORD 설정' },
              { title: '애드센스 슬롯 추가', desc: '승인 후 5개 광고 슬롯 ID를 환경변수에 추가' },
              { title: '도메인 연결', desc: 'Vercel → Settings → Domains → 구매한 도메인 연결' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < 4 ? '1px solid #1f1f1f' : 'none' }}>
                <div style={{ width: 28, height: 28, background: '#e63946', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
