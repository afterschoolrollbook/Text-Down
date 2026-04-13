import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const S = {
  page: { minHeight: '100vh', background: '#0c0c0c', fontFamily: "'Outfit', sans-serif", color: '#f0f0f0', padding: '0 0 60px' },
  wrap: { maxWidth: 720, margin: '0 auto', padding: '0 20px' },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28, marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 20 },
  row: { background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  input: { background: '#1f1f1f', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#f0f0f0', fontFamily: "'Outfit', sans-serif", fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' },
  textarea: { background: '#1f1f1f', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#f0f0f0', fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 120, lineHeight: 1.6 },
  label: { color: '#aaa', fontSize: 13, marginTop: 3 },
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
    setLoading(true)
    setErr('')
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
      <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, padding: 40, width: 340 }}>
        <h2 style={{ color: '#f0f0f0', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Text-Down Admin</h2>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 28 }}>관리자 비밀번호를 입력하세요</p>
        <form onSubmit={submit}>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호" style={{ ...S.input, marginBottom: 12 }} />
          {err && <p style={{ color: '#e63946', fontSize: 13, marginBottom: 10 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ ...S.btn(), width: '100%', opacity: loading ? 0.6 : 1 }}>{loading ? '확인 중...' : '로그인'}</button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState(null)
  const [adsOn, setAdsOn] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  // 블로그 글 작성
  const [slug, setSlug] = useState('')
  const [titleKo, setTitleKo] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descKo, setDescKo] = useState('')
  const [descEn, setDescEn] = useState('')
  const [contentKo, setContentKo] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [tags, setTags] = useState('')
  const [postMsg, setPostMsg] = useState('')
  const [postSaving, setPostSaving] = useState(false)

  // 블로그 글 목록
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) { setToken(t) }
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/get')
      const data = await res.json()
      setAdsOn(data.adsOn ?? true)
    } catch {}
  }, [])

  const loadPosts = useCallback(async (t) => {
    try {
      const res = await fetch('/api/blog/posts', { headers: { 'x-admin-token': t } })
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch {}
  }, [])

  useEffect(() => {
    if (token) { loadSettings(); loadPosts(token) }
  }, [token, loadSettings, loadPosts])

  const save = async () => {
    setSaving(true); setSaveMsg('')
    try {
      const res = await fetch('/api/settings/save', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ adsOn }) })
      const data = await res.json()
      setSaveMsg(data.ok ? '✅ 저장됨' : '❌ 실패')
    } catch { setSaveMsg('❌ 실패') }
    finally { setSaving(false); setTimeout(() => setSaveMsg(''), 2000) }
  }

  const changePw = async () => {
    if (!newPw || newPw.length < 6) { setPwMsg('6자 이상 입력하세요'); return }
    try {
      const res = await fetch('/api/settings/password', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ newPassword: newPw }) })
      const data = await res.json()
      setPwMsg(data.ok ? '✅ 변경됨' : '❌ 실패')
      if (data.ok) setNewPw('')
    } catch { setPwMsg('❌ 실패') }
    finally { setTimeout(() => setPwMsg(''), 2000) }
  }

  const submitPost = async () => {
    if (!slug || !titleKo || !contentKo) { setPostMsg('❌ slug, 제목(한), 본문(한) 필수'); return }
    setPostSaving(true); setPostMsg('')
    try {
      const res = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ slug, title_ko: titleKo, title_en: titleEn, description_ko: descKo, description_en: descEn, content_ko: contentKo, content_en: contentEn, tags: tags.split(',').map(t => t.trim()).filter(Boolean) })
      })
      const data = await res.json()
      if (res.ok) {
        setPostMsg('✅ 발행됨')
        setSlug(''); setTitleKo(''); setTitleEn(''); setDescKo(''); setDescEn(''); setContentKo(''); setContentEn(''); setTags('')
        loadPosts(token)
      } else { setPostMsg('❌ ' + (data.error || '실패')) }
    } catch { setPostMsg('❌ 실패') }
    finally { setPostSaving(false); setTimeout(() => setPostMsg(''), 3000) }
  }

  const togglePublish = async (post) => {
    try {
      await fetch('/api/blog/posts', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ id: post.id, published: !post.published }) })
      loadPosts(token)
    } catch {}
  }

  const deletePost = async (post) => {
    if (!confirm(`"${post.title_ko}" 삭제하시겠어요?`)) return
    try {
      await fetch('/api/blog/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ id: post.id }) })
      loadPosts(token)
    } catch {}
  }

  if (!token) return <LoginScreen onLogin={t => setToken(t)} />

  return (
    <>
      <Head><title>Admin · Text-Down</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" /></Head>
      <div style={S.page}>
        <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '16px 0', marginBottom: 28 }}>
          <div style={{ ...S.wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 18 }}>Text-Down <span style={{ color: '#555', fontWeight: 400, fontSize: 14 }}>admin</span></span>
            <button onClick={() => { sessionStorage.removeItem('admin_token'); setToken(null) }} style={{ background: 'none', border: '1px solid #333', color: '#888', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>로그아웃</button>
          </div>
        </div>

        <div style={S.wrap}>

          {/* 광고 설정 */}
          <div style={S.card}>
            <div style={S.cardTitle}>📢 광고 설정</div>
            <div style={S.row}>
              <div>
                <div style={{ color: '#f0f0f0', fontSize: 15, fontWeight: 600 }}>광고 표시</div>
                <div style={S.label}>사이트 전체 광고 노출 여부</div>
              </div>
              <Toggle value={adsOn} onChange={setAdsOn} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <button onClick={save} disabled={saving} style={{ ...S.btn(), opacity: saving ? 0.6 : 1 }}>{saving ? '저장 중...' : '저장하기'}</button>
            {saveMsg && <span style={{ fontSize: 14 }}>{saveMsg}</span>}
          </div>

          {/* 블로그 글 작성 */}
          <div style={S.card}>
            <div style={S.cardTitle}>✍️ 블로그 글 작성</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug (예: how-to-count-characters)" style={S.input} />
              <input value={titleKo} onChange={e => setTitleKo(e.target.value)} placeholder="제목 (한국어)" style={S.input} />
              <input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="제목 (English)" style={S.input} />
              <input value={descKo} onChange={e => setDescKo(e.target.value)} placeholder="설명 (한국어)" style={S.input} />
              <input value={descEn} onChange={e => setDescEn(e.target.value)} placeholder="Description (English)" style={S.input} />
              <textarea value={contentKo} onChange={e => setContentKo(e.target.value)} placeholder="본문 (한국어)" style={S.textarea} />
              <textarea value={contentEn} onChange={e => setContentEn(e.target.value)} placeholder="Content (English)" style={S.textarea} />
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="태그 (쉼표 구분: 텍스트, 글자수, 도구)" style={S.input} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <button onClick={submitPost} disabled={postSaving} style={{ ...S.btn(), opacity: postSaving ? 0.6 : 1 }}>{postSaving ? '발행 중...' : '발행하기'}</button>
                {postMsg && <span style={{ fontSize: 14 }}>{postMsg}</span>}
              </div>
            </div>
          </div>

          {/* 블로그 글 목록 */}
          <div style={S.card}>
            <div style={S.cardTitle}>📋 블로그 글 목록</div>
            {posts.length === 0 && <div style={{ color: '#555', fontSize: 14 }}>글이 없습니다.</div>}
            {posts.map(post => (
              <div key={post.id} style={{ ...S.row, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title_ko}</div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{post.slug}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: post.published ? '#22c55e' : '#555' }}>{post.published ? '공개' : '비공개'}</span>
                  <button onClick={() => togglePublish(post)} style={{ ...S.btn('#333'), padding: '6px 12px', fontSize: 12 }}>{post.published ? '비공개' : '공개'}</button>
                  <button onClick={() => deletePost(post)} style={{ ...S.btn('#7f1d1d'), padding: '6px 12px', fontSize: 12 }}>삭제</button>
                </div>
              </div>
            ))}
          </div>

          {/* 비밀번호 변경 */}
          <div style={S.card}>
            <div style={S.cardTitle}>🔒 비밀번호 변경</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 비밀번호 (6자 이상)" style={{ ...S.input, flex: 1 }} />
              <button onClick={changePw} style={S.btn('#444')}>변경</button>
            </div>
            {pwMsg && <p style={{ color: '#aaa', fontSize: 13, marginTop: 10 }}>{pwMsg}</p>}
          </div>

        </div>
      </div>
    </>
  )
}
