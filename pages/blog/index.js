import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const META = {
  ko: {
    title: '블로그 | Text-Down — 텍스트 도구 팁',
    desc: '글자수 세기, 텍스트 정리, 변환 등 텍스트 도구 관련 팁과 가이드를 제공합니다.',
    heading: '블로그',
    sub: '텍스트 도구 팁 & 가이드',
    empty: '아직 글이 없어요.',
    readMore: '읽기 →',
    langBtn: '🇺🇸 English',
    footer: '© 2024 Text-Down. 무료 온라인 텍스트 도구.',
  },
  en: {
    title: 'Blog | Text-Down — Text Tool Tips',
    desc: 'Tips and guides for text tools, character counting, and text processing.',
    heading: 'Blog',
    sub: 'Text Tool Tips & Guides',
    empty: 'No posts yet.',
    readMore: 'Read more →',
    langBtn: '🇰🇷 한국어',
    footer: '© 2024 Text-Down. Free Online Text Tools.',
  },
}

export default function BlogIndex() {
  const [lang, setLang] = useState('ko')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('yt_lang')
    if (saved && META[saved]) setLang(saved)
  }, [])

  useEffect(() => {
    fetch('/api/blog/posts')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('yt_lang', next)
  }

  const t = META[lang]

  const formatDate = (iso) => {
    const d = new Date(iso)
    return lang === 'ko'
      ? `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">▶</div>
            <span className="logo-text">Text<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            {t.heading}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 48 }}>{t.sub}</p>

          {loading && (
            <div style={{ color: 'var(--text3)', fontSize: 14, padding: '40px 0' }}>불러오는 중...</div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: 14, padding: '40px 0' }}>{t.empty}</div>
          )}

          <div className="post-list">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="post-card">
                <div className="post-meta">
                  <span className="post-date">{formatDate(post.created_at)}</span>
                  {post.tags && post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="post-tag">{tag}</span>
                  ))}
                </div>
                <h2 className="post-title">
                  {lang === 'ko' ? post.title_ko : (post.title_en || post.title_ko)}
                </h2>
                {(post.description_ko || post.description_en) && (
                  <p className="post-desc">
                    {lang === 'ko' ? post.description_ko : (post.description_en || post.description_ko)}
                  </p>
                )}
                <span className="read-more">{t.readMore}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">{t.footer}</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
            <Link href="/privacy" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>개인정보처리방침</Link>
            <Link href="/terms" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>이용약관</Link>
            <Link href="/faq" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>FAQ</Link>
          </div>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>

      <style jsx>{`
        .post-list { display: flex; flex-direction: column; gap: 16px; }
        .post-card {
          display: block; text-decoration: none;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px 28px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .post-card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .post-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
        .post-date { color: var(--text3); font-size: 12px; }
        .post-tag {
          background: rgba(230,57,70,0.1); color: var(--accent);
          border: 1px solid rgba(230,57,70,0.2);
          border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600;
        }
        .post-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.4; }
        .post-desc { font-size: 14px; color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
        .read-more { font-size: 13px; color: var(--accent); font-weight: 600; }
      `}</style>
    </>
  )
}
